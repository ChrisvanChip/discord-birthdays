const { EmbedBuilder } = require("discord.js");
const cron = require("node-cron");

module.exports = {
  schedule({ client, prisma, mainGuildId, announceChannelId, announcePingRoleId }) {
    const cronExpression = process.env.BIRTHDAY_JOB_CRON || "0 7 * * *";
    if (!cron.validate(cronExpression)) {
      console.error("Invalid BIRTHDAY_JOB_CRON expression.");
      return;
    }

    cron.schedule(
      cronExpression,
      async () => {
        if (!announceChannelId || !mainGuildId) {
          return;
        }

        const channel = await client.channels.fetch(announceChannelId).catch(() => null);
        if (!channel || !channel.isTextBased() || channel.guildId !== mainGuildId) {
          return;
        }

        const now = new Date();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();

        const birthdays = await prisma.birthday.findMany({
          where: {
            guildId: mainGuildId,
            month,
            day,
          },
          orderBy: { userId: "asc" },
        });

        if (birthdays.length === 0) {
          return;
        }

        const mentions = birthdays.map((entry) => `<@${entry.userId}>`).join(", ");
        const embed = new EmbedBuilder()
          .setColor(0x57f287)
          .setTitle("It's a special day! 🎉")
          .setDescription(`Because... it's ${mentions}'s birthday today!! Wish them a happy birthday <3`)
          .setTimestamp(new Date());

        await channel.send({
          content: announcePingRoleId ? `<@&${announcePingRoleId}>` : undefined,
          embeds: [embed],
          allowedMentions: announcePingRoleId
            ? {
                roles: [announcePingRoleId],
                users: birthdays.map((entry) => entry.userId),
              }
            : { users: birthdays.map((entry) => entry.userId) },
        });
      },
      { timezone: "UTC" }
    );
  },
};
