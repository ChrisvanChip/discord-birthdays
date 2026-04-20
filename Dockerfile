FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

CMD ["sh", "-c", "npx prisma db push && node src/index.js"]
