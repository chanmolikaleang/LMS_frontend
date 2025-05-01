import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // 👇 Webhook must receive raw body, not JSON-parsed
  app.use('/webhook', express.raw({ type: 'application/json' }));

  // Attach rawBody to the request object for Stripe verification
  app.use('/webhook', (req, res, next) => {
    (req as any).rawBody = req.body;
    next();
  });

  // 👇 Other routes can use standard body parser
  app.use(bodyParser.json());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
