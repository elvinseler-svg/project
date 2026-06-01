# ===== Сборка =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ===== Production =====
FROM node:20-alpine AS production
WORKDIR /app
# NODE_ENV задаётся в рантайме (docker-compose), чтобы npm ci установил и dev-зависимости,
# нужные для миграций (prisma CLI) и сид-скрипта (ts-node).
COPY package*.json ./
RUN npm ci
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY tsconfig*.json ./
RUN npx prisma generate
EXPOSE 3000
# Применяем миграции, сидируем администратора, запускаем собранный сервер
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/main"]
