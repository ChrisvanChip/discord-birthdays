const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, context) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (!interaction.inGuild() || interaction.guildId !== context.mainGuildId) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle("Guild not allowed")
            .setDescription("This bot is configured for a different guild."),
        ],
        ephemeral: true,
      });
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

    try {
      await command.execute(interaction, context);
    } catch (error) {
      console.error(`Command execution failed: ${interaction.commandName}`, error);
      const response = {
        content: "Something went wrong while running that command. Please try again or contact an administrator.",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    }
  },
};
