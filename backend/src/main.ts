import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // Trust proxy for real client IP
  app.set('trust proxy', true);


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
