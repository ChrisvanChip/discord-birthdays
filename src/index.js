require("dotenv").config();

const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const { loadCommands } = require("./loaders/command-loader");
const { loadEvents } = require("./loaders/event-loader");
const { loadJobs } = require("./loaders/job-loader");

const token = process.env.BOT_TOKEN;
const mainGuildId = process.env.MAIN_GUILD;

if (!token || !mainGuildId) {
  throw new Error("BOT_TOKEN and MAIN_GUILD are required.");
}

const prisma = new PrismaClient();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const context = {
  prisma,
  mainGuildId,
  managerRoleId: process.env.MANAGER_ROLE || "",
  calendarChannelId: process.env.CALENDAR_CHANNEL || "",
  announceChannelId: process.env.ANNOUNCE_CHANNEL || "",
  announcePingRoleId: process.env.ANNOUNCE_PING || "",
};

loadCommands(client, path.join(__dirname, "commands"));
loadEvents(client, path.join(__dirname, "events"), context);
loadJobs(path.join(__dirname, "jobs"), { client, ...context });

client.login(token);

const shutdown = async () => {
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
