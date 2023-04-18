import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    })
  );
  app.use(cors({
    origin: "*"
  }));
  await app.listen(process.env['APP_PORT'] || 3000);
}
bootstrap();
