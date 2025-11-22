import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,         // ponlo true solo si vas a usar cookies
    maxAge: 86400,              // cache del preflight OPTIONS
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(80);
}
bootstrap();
