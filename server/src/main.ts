import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Все маршруты под префиксом /api
  app.setGlobalPrefix('api');

  // Разрешаем запросы с клиента (dev-прокси Vite / другой origin)
  app.enableCors();

  // Глобальная валидация DTO + приведение типов
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Сервер запущен на http://localhost:${port}/api`);
}
bootstrap();
