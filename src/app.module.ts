import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource, mainDataSource } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { NewsEntity } from './core/entitys/main/news.entity';
import { TeamEntity } from './core/entitys/main/team.entity';
import { DataSource } from 'typeorm';
import { ChartsModule } from './charts/charts.module';
import { SongsModule } from './songs/songs.module';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedirectModule } from './redirect/redirect.module';
import { PlaylistModule } from './playlist/playlist.module';
import { LikeModule } from './like/like.module';
import { QnaModule } from './qna/qna.module';
import { NoticeModule } from './notice/notice.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { CategoriesModule } from './categories/categories.module';
import { BullModule } from '@nestjs/bull';
import * as redisStore from 'cache-manager-ioredis';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from './core/interceptor/http-cache.interceptor';
import { VersionEntity } from './core/entitys/app/version.entity';
import { EventEntity } from './core/entitys/app/event.entity';
import { FileModule } from './file/file.module';
import { RedisOptions } from 'ioredis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';
import { ThrottlerBehindProxyGuard } from './core/guard/throttler-proxy.guard';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.CACHE_BULL_HOST,
        port: parseInt(process.env.CACHE_BULL_PORT) || 6379,
      },
    }),
    CacheModule.register<RedisOptions>({
      isGlobal: true,
      store: redisStore,
      host: process.env.CACHE_MAIN_HOST,
      port: parseInt(process.env.CACHE_MAIN_PORT) || 6379,
      password: process.env.CACHE_MAIN_PASSWORD,
      ttl: (parseInt(process.env.CACHE_TTL) || 1) * 60,
    }),
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.LIMIT_TTL) || 1,
      limit: parseInt(process.env.LIMIT_LIMIT) || 10,
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.CACHE_LIMIT_HOST,
          port: parseInt(process.env.CACHE_LIMIT_PORT) || 6379,
          password: process.env.CACHE_LIMIT_PASSWORD,
        }),
      ),
    }),
    TypeOrmModule.forRoot(mainDataSource),
    TypeOrmModule.forRoot(appDataSource),
    TypeOrmModule.forFeature([NewsEntity, TeamEntity]),
    TypeOrmModule.forFeature([VersionEntity, EventEntity], 'app'),
    ChartsModule,
    SongsModule,
    ArtistModule,
    AuthModule,
    UserModule,
    RedirectModule,
    PlaylistModule,
    LikeModule,
    QnaModule,
    NoticeModule,
    CategoriesModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
