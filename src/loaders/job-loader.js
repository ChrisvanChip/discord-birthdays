const fs = require("node:fs");
const path = require("node:path");

function loadJobs(jobsDir, context) {
  const files = fs.readdirSync(jobsDir).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const job = require(path.join(jobsDir, file));

    if (typeof job.schedule !== "function") {
      console.warn(`Skipping invalid job module: ${file}`);
      continue;
    }

    job.schedule(context);
  }
}

module.exports = { loadJobs };
