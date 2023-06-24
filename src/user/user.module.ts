import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from '../playlist/playlist.module';
import { LikeModule } from '../like/like.module';
import { SongsModule } from '../songs/songs.module';
import { CategoriesModule } from '../categories/categories.module';
import { UserEntity } from 'src/core/entitys/main/user.entity';
import { ProfileEntity } from 'src/core/entitys/main/profile.entity';
import { UserPlaylistEntity } from 'src/core/entitys/main/userPlaylist.entity';
import { UserPermissionEntity } from 'src/core/entitys/main/userPermission.entity';
import { UserAccessLogEntity } from 'src/core/entitys/main/userAccessLog.entity';
import { UserLikeEntity } from 'src/core/entitys/main/userLike.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      UserPlaylistEntity,
      UserLikeEntity,
      UserPermissionEntity,
      UserAccessLogEntity,
    ]),
    PlaylistModule,
    LikeModule,
    SongsModule,
    CategoriesModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
