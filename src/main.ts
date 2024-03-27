import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: function(req, res) {
    return req.ip || req.connection.remoteAddress;
  }
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(limiter);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  await app.listen(3000);
}
bootstrap();
