const { EmbedBuilder, escapeMarkdown } = require("discord.js");
const cron = require("node-cron");

module.exports = {
  schedule({
    client,
    prisma,
    mainGuildId,
    announceChannelId,
    announcePingRoleId,
  }) {
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

        const channel = await client.channels
          .fetch(announceChannelId)
          .catch(() => null);
        if (
          !channel ||
          !channel.isTextBased() ||
          channel.guildId !== mainGuildId
        ) {
          return;
        }

        const now = new Date();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();

        const birthdays = await prisma.birthday.findMany({
          where: {
            guildId: mainGuildId,
            isActive: true,
            month,
            day,
          },
          orderBy: { userId: "asc" },
        });

        if (birthdays.length === 0) {
          return;
        }

        const guild = await client.guilds.fetch(mainGuildId);
        const birthdayMembers = await Promise.all(
          birthdays.map((entry) =>
            guild.members.fetch(entry.userId).catch(() => null),
          ),
        );

        const displayNames = await Promise.all(
          birthdays.map(async (entry, index) => {
            const member = birthdayMembers[index];
            if (member) {
              return member.displayName;
            }

            const user = await client.users.fetch(entry.userId).catch(() => null);
            return user?.displayName || user?.username || "Unknown member";
          }),
        );

        const formattedNames = displayNames.map(
          (name) => `**${escapeMarkdown(name)}**`,
        );
        const names =
          formattedNames.length === 1
            ? formattedNames[0]
            : `${formattedNames.slice(0, -1).join(", ")} and ${formattedNames.at(-1)}`;

        const description =
          birthdays.length === 1
            ? `Because... it's ${names}'s birthday today!! Wish them a happy birthday <3`
            : `Because... ${names} have birthdays today!! Wish them a happy birthday <3`;

        const birthdayMentions = birthdays
          .map((entry) => `<@${entry.userId}>`)
          .join(" ");

        const content = [announcePingRoleId ? `<@&${announcePingRoleId}>` : null, birthdayMentions]
          .filter(Boolean)
          .join(" ");

        const embed = new EmbedBuilder()
          .setColor(0x57f287)
          .setTitle("It's a special day! 🎉")
          .setDescription(description)
          .setTimestamp(new Date());

        await channel.send({
          content,
          embeds: [embed],
          allowedMentions: {
            roles: announcePingRoleId ? [announcePingRoleId] : [],
            users: birthdays.map((entry) => entry.userId),
          },
        });
      },
      { timezone: "UTC" },
    );
  },
};
