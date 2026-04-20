const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { syncCalendarEmbed } = require("../services/calendar");

function isValidDate(month, day, year) {
  const safeYear = year ?? 2000;
  const date = new Date(Date.UTC(safeYear, month - 1, day));
  return date.getUTCFullYear() === safeYear && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

function birthdayLabel(day, month, year) {
  const base = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}`;
  return year ? `${base}-${year}` : base;
}

function birthdayReplyEmbed(title, description) {
  return new EmbedBuilder().setColor(0x5865f2).setTitle(title).setDescription(description);
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
            .setName("day")
            .setDescription("Birth day")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(31)
        )
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
            .setName("year")
            .setDescription("Birth year (optional)")
            .setRequired(false)
            .setMinValue(1900)
            .setMaxValue(2100)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Manager-only birthday update")
        .addUserOption((option) => option.setName("user").setDescription("User to update").setRequired(true))
        .addIntegerOption((option) =>
          option
            .setName("day")
            .setDescription("Birth day")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(31)
        )
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
            .setName("year")
            .setDescription("Birth year (optional)")
            .setRequired(false)
            .setMinValue(1900)
            .setMaxValue(2100)
        )
    ),

  async execute(interaction, context) {
    const subcommand = interaction.options.getSubcommand();
    const day = interaction.options.getInteger("day", true);
    const month = interaction.options.getInteger("month", true);
    const year = interaction.options.getInteger("year", false);

    if (!isValidDate(month, day, year)) {
      await interaction.reply({
        embeds: [birthdayReplyEmbed("Invalid Date", "That date is invalid. Please use a real calendar day.")],
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "register") {
      const existing = await context.prisma.birthday.findUnique({
        where: {
          guildId_userId: {
            guildId: interaction.guildId,
            userId: interaction.user.id,
          },
        },
      });

      if (existing) {
        await interaction.reply({
          embeds: [
            birthdayReplyEmbed(
              "Birthday Already Registered",
              "You already registered your birthday. Please contact a manager if you need it updated."
            ),
          ],
          ephemeral: true,
        });
        return;
      }

      await context.prisma.birthday.create({
        data: {
          guildId: interaction.guildId,
          userId: interaction.user.id,
          day,
          month,
          year,
        },
      });

      await syncCalendarEmbed({
        prisma: context.prisma,
        client: interaction.client,
        guildId: interaction.guildId,
        calendarChannelId: context.calendarChannelId,
      });

      await interaction.reply({
        embeds: [birthdayReplyEmbed("Birthday Registered", `Saved birthday as ${birthdayLabel(day, month, year)}.`)],
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "update") {
      const managerRoleId = context.managerRoleId;
      const hasRole = Boolean(managerRoleId && interaction.member?.roles?.cache?.has(managerRoleId));

      if (!hasRole) {
        await interaction.reply({
          embeds: [birthdayReplyEmbed("Permission Denied", "Only managers can use this command.")],
          ephemeral: true,
        });
        return;
      }

      const targetUser = interaction.options.getUser("user", true);

      await context.prisma.birthday.upsert({
        where: {
          guildId_userId: {
            guildId: interaction.guildId,
            userId: targetUser.id,
          },
        },
        update: { day, month, year },
        create: {
          guildId: interaction.guildId,
          userId: targetUser.id,
          day,
          month,
          year,
        },
      });

      await syncCalendarEmbed({
        prisma: context.prisma,
        client: interaction.client,
        guildId: interaction.guildId,
        calendarChannelId: context.calendarChannelId,
      });

      await interaction.reply({
        embeds: [
          birthdayReplyEmbed("Birthday Updated", `Updated <@${targetUser.id}> to ${birthdayLabel(day, month, year)}.`),
        ],
        ephemeral: true,
      });
    }
  },
};
