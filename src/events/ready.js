const { syncCalendarEmbed } = require("../services/calendar");

module.exports = {
  name: "ready",
  once: true,
  async execute(client, context) {
    console.log(`Logged in as ${client.user.tag}`);

    await syncCalendarEmbed({
      prisma: context.prisma,
      client,
      guildId: context.mainGuildId,
      calendarChannelId: context.calendarChannelId,
    });
  },
};
