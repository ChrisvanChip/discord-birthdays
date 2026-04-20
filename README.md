# discord-birthdays

Self-hosted Discord bot for birthday registration in a single guild.

## Features

- Discord.js bot with automatic loading for commands, events, and jobs.
- Prisma + PostgreSQL persistence.
- Slash command: `/birthday register`.
- Dockerized deployment with `docker-compose`.

## Environment

Copy `.env.example` to `.env` and fill in values:

- `BOT_TOKEN`: Discord bot token.
- `CLIENT_ID`: Discord application client ID.
- `DATABASE_URL`: Postgres connection string.
- `GUILD_ID` (optional): If set, slash commands are registered to this guild.
- `BIRTHDAY_ANNOUNCEMENT_CHANNEL_ID` (optional): Channel to post birthday announcements.
- `BIRTHDAY_JOB_CRON` (optional): Cron expression for birthday announcements (UTC).

## Local setup

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run deploy:commands
npm start
```

## Docker

```bash
cp .env.example .env
# fill BOT_TOKEN and CLIENT_ID (and optionally others)
docker compose up --build
```
