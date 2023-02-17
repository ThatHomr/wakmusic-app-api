import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { PlaylistModule } from '../playlist/playlist.module';
import { LikeModule } from '../like/like.module';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], 'user'),
    PlaylistModule,
    LikeModule,
    SongsModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
