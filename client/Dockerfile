FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости отдельным слоем
COPY package*.json ./
RUN npm install

# Копируем исходники (в dev перекрываются bind-mount'ом из docker-compose)
COPY . .

EXPOSE 5173

# Vite dev-сервер, слушает все интерфейсы (доступен с хоста)
CMD ["npm", "run", "dev", "--", "--host"]
