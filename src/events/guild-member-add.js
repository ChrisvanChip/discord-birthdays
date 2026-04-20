const { syncCalendarEmbed } = require("../services/calendar");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, context) {
    if (!member?.guild?.id || member.guild.id !== context.mainGuildId) {
      return;
    }

    await context.prisma.birthday.updateMany({
      where: {
        guildId: member.guild.id,
        userId: member.user.id,
      },
      data: { isActive: true },
    });

    await syncCalendarEmbed({
      prisma: context.prisma,
      client: member.client,
      guildId: member.guild.id,
      calendarChannelId: context.calendarChannelId,
    });
  },
};
