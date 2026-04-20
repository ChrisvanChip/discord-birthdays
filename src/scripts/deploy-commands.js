require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  throw new Error("BOT_TOKEN and CLIENT_ID are required.");
}

const commandsDir = path.join(__dirname, "..", "commands");
const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith(".js"));
const commands = commandFiles
  .map((file) => require(path.join(commandsDir, file)).data?.toJSON())
  .filter(Boolean);

const rest = new REST({ version: "10" }).setToken(token);

async function deploy() {
  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  await rest.put(route, { body: commands });
  console.log(`Registered ${commands.length} command(s) ${guildId ? `for guild ${guildId}` : "globally"}.`);
}

deploy();
