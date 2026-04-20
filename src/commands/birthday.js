const { SlashCommandBuilder } = require("discord.js");

function isValidDate(month, day) {
  const date = new Date(Date.UTC(2000, month - 1, day));
  return date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Manage birthdays")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("register")
        .setDescription("Register your birthday")
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("Birth month (1-12)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(12)
        )
        .addIntegerOption((option) =>
          option
            .setName("day")
            .setDescription("Birth day")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(31)
        )
    ),

  async execute(interaction, { prisma }) {
    if (interaction.options.getSubcommand() !== "register") {
      return;
    }

    const month = interaction.options.getInteger("month", true);
    const day = interaction.options.getInteger("day", true);

    if (!isValidDate(month, day)) {
      await interaction.reply({
        content: "That date is invalid. Please use a real calendar day.",
        ephemeral: true,
      });
      return;
    }

    await prisma.birthday.upsert({
      where: {
        guildId_userId: {
          guildId: interaction.guildId,
          userId: interaction.user.id,
        },
      },
      update: { month, day },
      create: {
        guildId: interaction.guildId,
        userId: interaction.user.id,
        month,
        day,
      },
    });

    await interaction.reply({
      content: `Birthday saved as ${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}.`,
      ephemeral: true,
    });
  },
};
