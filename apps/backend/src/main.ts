import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Allow frontend to connect
  app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://copycat-mauve.vercel.app',       // ← your exact Vercel URL
    /\.vercel\.app$/,                     // ← covers all Vercel preview deployments
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});


  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 5000;


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );


  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );


  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );


  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();