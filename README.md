# Discord Birthdays 🎉

Self-hosted Discord bot to celebrate birthdays in your server.

## Features

- Users can register their birthday with `/birthday register`
- When it's their special day, the bot will ping a role (like @Birthday Pings) so your members can celebrate their birthday
- Birthday calendar in a channel (like #birthdays), this embed will be updated when members register their birthdays

## Environment

Copy `.env.example` to `.env`. For reference:

| Variable | Description |
| :--- | :--- |
| `BOT_TOKEN` | Discord bot token |
| `CLIENT_ID` | Discord application client ID |
| `MAIN_GUILD` | Guild ID this bot is allowed to operate in |
| `MANAGER_ROLE` | Role ID allowed to run `/birthday update` |
| `CALENDAR_CHANNEL` | Channel ID to host the birthday calendar embed |
| `ANNOUNCE_CHANNEL` | Channel ID for birthday announcement embeds |
| `ANNOUNCE_PING` | Role ID to mention in announcement message content |
| `BIRTHDAY_JOB_CRON` | Cron expression (UTC) for birthday checks (default `0 7 * * *`) |
| `POSTGRES_DB` | Postgres database name for Docker Compose |
| `POSTGRES_USER` | Postgres username for Docker Compose |
| `POSTGRES_PASSWORD` | Postgres password for Docker Compose |
| `DATABASE_URL` | Prisma connection string |

## Local

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
# fill .env fields, then:
docker compose up --build
```
