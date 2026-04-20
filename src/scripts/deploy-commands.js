require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.MAIN_GUILD;

if (!token || !clientId || !guildId) {
  throw new Error("BOT_TOKEN, CLIENT_ID, and MAIN_GUILD are required.");
}

const commandsDir = path.join(__dirname, "..", "commands");
const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith(".js"));
const commands = commandFiles
  .map((file) => require(path.join(commandsDir, file)).data?.toJSON())
  .filter(Boolean);

const rest = new REST({ version: "10" }).setToken(token);

async function deploy() {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log(`Registered ${commands.length} command(s) for guild ${guildId}.`);
  } catch (error) {
    console.error("Failed to deploy slash commands.", error);
    process.exit(1);
  }
}

deploy();
