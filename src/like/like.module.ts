import { Module, forwardRef } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartsModule } from '../charts/charts.module';
import { SongsModule } from '../songs/songs.module';
import { LikeEntity } from 'src/entitys/main/like.entity';
import { UserLikesEntity } from 'src/entitys/main/userLikes.entity';
import { UserLikesSongsEntity } from 'src/entitys/main/userLikesSongs.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LikeEntity,
      UserLikesEntity,
      UserLikesSongsEntity,
    ]),
    ChartsModule,
    SongsModule,
    forwardRef(() => UserModule),
  ],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
