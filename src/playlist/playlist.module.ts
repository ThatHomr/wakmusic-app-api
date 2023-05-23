import { Module, forwardRef } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from '../songs/songs.module';
import { BullModule } from '@nestjs/bull';
import { PlaylistProcessor } from './playlist.processor';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { UserPlaylistsEntity } from 'src/core/entitys/main/userPlaylists.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { PlaylistCopyEntity } from 'src/core/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogsEntity } from 'src/core/entitys/main/playlistCopyLogs.entity';
import { PlaylistSongsEntity } from 'src/core/entitys/main/playlistSongs.entity';
import { UserPlaylistPlaylistsEntity } from 'src/core/entitys/main/userPlaylistsPlaylists.entity';
import { RecommendedPlaylistSongsEntity } from 'src/core/entitys/main/recommendedPlaylistSongs.entity';
import { RecommendedPlaylistImageEntity } from 'src/core/entitys/main/recommendedPlaylistImage.entity';
import { UserModule } from 'src/user/user.module';
import { PlaylistImageEntity } from 'src/core/entitys/main/playlistImage.entity';
import { UserEntity } from 'src/core/entitys/main/user.entity';

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
