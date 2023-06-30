import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './utils/swagger.utils';
import * as process from 'process';
import { GlobalPrefixOptions } from '@nestjs/common/interfaces';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import * as WinstonDaily from 'winston-daily-rotate-file';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: format.combine(
            format.timestamp(),
            utilities.format.nestLike('Wakmusic', {
              prettyPrint: true,
            }),
          ),
        }),
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(__dirname, process.env.LOG_DIR, '/error'),
          filename: '%DATE%.error.log',
          maxFiles: 30,
          zippedArchive: true,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.printf((info) => {
              if (info.stack) {
                return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`;
              }
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
        new WinstonDaily({
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(__dirname, process.env.LOG_DIR, '/info'),
          filename: '%DATE%.info.log',
          maxFiles: 30,
          zippedArchive: true,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.printf((info) => {
              if (info.stack) {
                return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`;
              }
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

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

  const prefixOptions: GlobalPrefixOptions = { exclude: [] };
  if (process.env.NODE_ENV === 'maintainance') {
    prefixOptions.exclude = [
      {
        path: '/artist/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/charts/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/like/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/notice/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/qna/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/playlist/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/user/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/auth/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/songs/(.*)',
        method: RequestMethod.ALL,
      },
      {
        path: '/teams',
        method: RequestMethod.ALL,
      },
      {
        path: '/news',
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
