# discord-birthdays

Self-hosted Discord bot for birthday registration in one guild.

## Features

- Discord.js + Node.js architecture with auto-loading for commands, events, and jobs.
- Prisma ORM with PostgreSQL persistence.
- `/birthday register <day> <month> [year]` (immutable for regular users).
- `/birthday update <user> <day> <month> [year]` restricted to `MANAGER_ROLE`.
- Calendar embed in `CALENDAR_CHANNEL` with persisted message id and auto-updates.
- UTC birthday announcements in `ANNOUNCE_CHANNEL` with `ANNOUNCE_PING` role mention.
- Guild restriction via `MAIN_GUILD`.

## Environment

Copy `.env.example` to `.env` and set values:

- `BOT_TOKEN`: Discord bot token.
- `CLIENT_ID`: Discord application client ID.
- `MAIN_GUILD`: Guild ID this bot is allowed to operate in.
- `MANAGER_ROLE`: Role ID allowed to run `/birthday update`.
- `CALENDAR_CHANNEL`: Channel ID to host the birthday calendar embed.
- `ANNOUNCE_CHANNEL`: Channel ID for birthday announcement embeds.
- `ANNOUNCE_PING`: Role ID to mention in announcement message content.
- `BIRTHDAY_JOB_CRON`: Cron expression (UTC) for birthday checks (default `0 0 * * *`).
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Postgres service variables for Docker Compose.
- `DATABASE_URL`: Prisma connection string.

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
# fill required variables

docker compose up --build
```
