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
import { UserPlaylistsEntity } from 'src/core/entitys/main/userPlaylists.entity';
import { UserPlaylistPlaylistsEntity } from 'src/core/entitys/main/userPlaylistsPlaylists.entity';
import { UserPermissionsEntity } from 'src/core/entitys/main/userPermissions.entity';
import { UserAccessLogsEntity } from 'src/core/entitys/main/userAccessLogs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      UserPlaylistsEntity,
      UserPlaylistPlaylistsEntity,
      UserPermissionsEntity,
      UserAccessLogsEntity,
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
