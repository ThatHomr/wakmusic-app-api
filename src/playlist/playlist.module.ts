import { Module, forwardRef } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from '../songs/songs.module';
import { BullModule } from '@nestjs/bull';
import { PlaylistProcessor } from './playlist.processor';
import { PlaylistEntity } from 'src/entitys/main/playlist.entity';
import { UserPlaylistsEntity } from 'src/entitys/main/userPlaylists.entity';
import { RecommendedPlaylistEntity } from 'src/entitys/main/recommendedPlaylist.entity';
import { PlaylistCopyEntity } from 'src/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogsEntity } from 'src/entitys/main/playlistCopyLogs.entity';
import { PlaylistSongsEntity } from 'src/entitys/main/playlistSongs.entity';
import { UserPlaylistPlaylistsEntity } from 'src/entitys/main/userPlaylistsPlaylists.entity';
import { RecommendedPlaylistSongsEntity } from 'src/entitys/main/recommendedPlaylistSongs.entity';
import { RecommendedPlaylistImageEntity } from 'src/entitys/main/recommendedPlaylistImage.entity';
import { UserModule } from 'src/user/user.module';
import { PlaylistImageEntity } from 'src/entitys/main/playlistImage.entity';
import { UserEntity } from 'src/entitys/main/user.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'playlist',
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      PlaylistEntity,
      PlaylistSongsEntity,
      PlaylistImageEntity,
      UserPlaylistsEntity,
      UserPlaylistPlaylistsEntity,
      RecommendedPlaylistEntity,
      RecommendedPlaylistSongsEntity,
      RecommendedPlaylistImageEntity,
      PlaylistCopyEntity,
      PlaylistCopyLogsEntity,
    ]),
    SongsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistProcessor],
  exports: [PlaylistService],
})
export class PlaylistModule {}
