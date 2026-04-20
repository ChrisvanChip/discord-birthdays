module.exports = {
  name: "interactionCreate",
  async execute(interaction, context) {
    if (!interaction.isChatInputCommand()) {
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
