FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости отдельным слоем (кэшируется при неизменном package.json)
COPY package*.json ./
RUN npm install

# Копируем исходники (в dev перекрываются bind-mount'ом из docker-compose)
COPY . .

EXPOSE 3000

# Команда переопределяется в docker-compose (generate + migrate + seed + start:dev)
CMD ["npm", "run", "start:dev"]
