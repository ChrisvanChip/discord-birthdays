require("dotenv").config();

const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const { loadCommands } = require("./loaders/command-loader");
const { loadEvents } = require("./loaders/event-loader");
const { loadJobs } = require("./loaders/job-loader");

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is required.");
}

const prisma = new PrismaClient();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

loadCommands(client, path.join(__dirname, "commands"));
loadEvents(client, path.join(__dirname, "events"), { prisma });
loadJobs(path.join(__dirname, "jobs"), { client, prisma });

client.login(token);

const shutdown = async () => {
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
