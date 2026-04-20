<div style="text-align: center;">
  <img width="1280" height="640" alt="Banner" src="https://github.com/user-attachments/assets/0d8a5aac-813a-444a-8ce4-370173d003c2" />
</div>

### Self-hosted Discord bot to celebrate your member's birthdays.

Built to fill the gap of good self-hostable birthday bots, this project provides a lightweight, reliable solution to automate birthday announcements for your Discord community.

Featuring simple registration via `/birthday register`, the bot triggers automated role pings on your member's special day, and maintains a dynamic birthday calendar channel.

Built with security in mind, so your users cannot update their birthday more than once. And when a member leaves? We'll clean them up from the calendar right away!

## Environment

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

## Local setup (dev)

```bash
cp .env.example .env

# fill .env fields, then:

npm install
npm run prisma:generate
npm run prisma:push
npm run deploy:commands
npm start
```

## Docker setup (prod)

```bash
cp .env.example .env

# fill .env fields, then:

docker compose up --build
```
