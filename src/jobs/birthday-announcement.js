const cron = require("node-cron");

module.exports = {
  schedule({ client, prisma }) {
    const cronExpression = process.env.BIRTHDAY_JOB_CRON || "0 9 * * *";
    if (!cron.validate(cronExpression)) {
      console.error(`Invalid BIRTHDAY_JOB_CRON expression: ${cronExpression}`);
      return;
    }

    cron.schedule(cronExpression, async () => {
      const channelId = process.env.BIRTHDAY_ANNOUNCEMENT_CHANNEL_ID;

      if (!channelId) {
        return;
      }

      const channel = await client.channels.fetch(channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) {
        return;
      }

      const now = new Date();
      const month = now.getUTCMonth() + 1;
      const day = now.getUTCDate();

      const birthdays = await prisma.birthday.findMany({
        where: {
          guildId: channel.guildId,
          month,
          day,
        },
      });
      if (birthdays.length === 0) {
        return;
      }

      const mentions = birthdays.map((entry) => `<@${entry.userId}>`).join(", ");
      await channel.send(`🎉 Happy birthday ${mentions}!`);
    });
  },
};
