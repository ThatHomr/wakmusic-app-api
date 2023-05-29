import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './utils/swagger.utils';
import * as process from 'process';
import { GlobalPrefixOptions } from '@nestjs/common/interfaces';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const prefixOptions: GlobalPrefixOptions = {};
  if (process.env.NODE_ENV === 'maintainance') {
    prefixOptions.exclude = [
      {
        path: 'artist/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'charts/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'like/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'notice/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'qna/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'playlist/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'user/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'auth/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'songs/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'teams/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: 'news/(.*)',
        method: RequestMethod.ALL,
      },
    ];
  }
  app.setGlobalPrefix('api', prefixOptions);

  setupSwagger(app);
  // setupPm2(app);

  await app.listen(process.env.PORT, () => {
    console.log(`application is listening on port ${process.env.PORT}`);
  });
}
bootstrap();
