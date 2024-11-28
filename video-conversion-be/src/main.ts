import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  if (process.env.CORS_ORIGIN) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  }

  await app.listen(3000);
}
bootstrap();
