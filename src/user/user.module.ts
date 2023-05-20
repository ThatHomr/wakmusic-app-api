import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from '../playlist/playlist.module';
import { LikeModule } from '../like/like.module';
import { SongsModule } from '../songs/songs.module';
import { CategoriesModule } from '../categories/categories.module';
import { UserEntity } from 'src/entitys/main/user.entity';
import { ProfileEntity } from 'src/entitys/main/profile.entity';
import { UserPlaylistsEntity } from 'src/entitys/main/userPlaylists.entity';
import { UserPlaylistPlaylistsEntity } from 'src/entitys/main/userPlaylistsPlaylists.entity';
import { UserPermissionsEntity } from 'src/entitys/main/userPermissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      UserPlaylistsEntity,
      UserPlaylistPlaylistsEntity,
      UserPermissionsEntity,
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
