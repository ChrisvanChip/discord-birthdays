const { EmbedBuilder } = require("discord.js");

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatBirthday(entry) {
  const monthName = MONTH_NAMES[entry.month - 1] ?? String(entry.month);
  return entry.year ? `${entry.day} ${monthName} ${entry.year}` : `${entry.day} ${monthName}`;
}

function buildCalendarEmbed(birthdays) {
  const byMonth = new Map();

  for (const birthday of birthdays) {
    if (!byMonth.has(birthday.month)) {
      byMonth.set(birthday.month, []);
    }
    byMonth.get(birthday.month).push(birthday);
  }

  const fields = [];
  for (let month = 1; month <= 12; month += 1) {
    const entries = byMonth.get(month);
    if (!entries || entries.length === 0) {
      continue;
    }

    entries.sort((a, b) => a.day - b.day || a.userId.localeCompare(b.userId));
    fields.push({
      name: MONTH_NAMES[month - 1],
      value: entries.map((entry) => `<@${entry.userId}> — ${formatBirthday(entry)}`).join("\n"),
      inline: false,
    });
  }

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Birthday Calendar")
    .setDescription("🔹 Register your own birthday with `/birthday register <day> <month>`")
    .setFields(fields)
    .setTimestamp(new Date());
}

async function upsertCalendarMessageId(prisma, guildId, calendarMessageId) {
  await prisma.guildConfig.upsert({
    where: { guildId },
    update: { calendarMessageId },
    create: { guildId, calendarMessageId },
  });
}

async function syncCalendarEmbed({ prisma, client, guildId, calendarChannelId }) {
  if (!calendarChannelId) {
    return;
  }

  const channel = await client.channels.fetch(calendarChannelId).catch(() => null);
  if (!channel || !channel.isTextBased() || channel.guildId !== guildId) {
    return;
  }

  const birthdays = await prisma.birthday.findMany({ where: { guildId } });
  const embed = buildCalendarEmbed(birthdays);

  const config = await prisma.guildConfig.findUnique({ where: { guildId } });
  let message = null;

  if (config?.calendarMessageId) {
    message = await channel.messages.fetch(config.calendarMessageId).catch(() => null);
  }

  if (!message) {
    message = await channel.send({ embeds: [embed] });
    await upsertCalendarMessageId(prisma, guildId, message.id);
    return;
  }

  await message.edit({ embeds: [embed] });
}

module.exports = { syncCalendarEmbed };
