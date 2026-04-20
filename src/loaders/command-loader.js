const fs = require("node:fs");
const path = require("node:path");

function loadCommands(client, commandsDir) {
  const files = fs.readdirSync(commandsDir).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));

    if (!command?.data || typeof command.execute !== "function") {
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

module.exports = { loadCommands };
