const fs = require("node:fs");
const path = require("node:path");

function loadEvents(client, eventsDir, context) {
  const files = fs.readdirSync(eventsDir).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const event = require(path.join(eventsDir, file));

    if (!event?.name || typeof event.execute !== "function") {
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, context));
      continue;
    }

    client.on(event.name, (...args) => event.execute(...args, context));
  }
}

module.exports = { loadEvents };
