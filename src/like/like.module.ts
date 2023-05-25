import { Module, forwardRef } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartsModule } from '../charts/charts.module';
import { SongsModule } from '../songs/songs.module';
import { LikeEntity } from 'src/core/entitys/main/like.entity';
import { UserLikeEntity } from 'src/core/entitys/main/userLike.entity';
import { UserLikeSongEntity } from 'src/core/entitys/main/userLikeSong.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, UserLikeEntity, UserLikeSongEntity]),
    ChartsModule,
    SongsModule,
    forwardRef(() => UserModule),
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
