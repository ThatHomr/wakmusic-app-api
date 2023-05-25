import { Module, forwardRef } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from '../songs/songs.module';
import { BullModule } from '@nestjs/bull';
import { PlaylistProcessor } from './playlist.processor';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { UserPlaylistEntity } from 'src/core/entitys/main/userPlaylist.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { PlaylistCopyEntity } from 'src/core/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogEntity } from 'src/core/entitys/main/playlistCopyLog.entity';
import { PlaylistSongEntity } from 'src/core/entitys/main/playlistSong.entity';
import { UserPlaylistPlaylistEntity } from 'src/core/entitys/main/userPlaylistPlaylist.entity';
import { RecommendedPlaylistSongEntity } from 'src/core/entitys/main/recommendedPlaylistSong.entity';
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
      PlaylistSongEntity,
      PlaylistImageEntity,
      UserPlaylistEntity,
      UserPlaylistPlaylistEntity,
      RecommendedPlaylistEntity,
      RecommendedPlaylistSongEntity,
      RecommendedPlaylistImageEntity,
      PlaylistCopyEntity,
      PlaylistCopyLogEntity,
    ]),
    SongsModule,
    forwardRef(() => UserModule),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistProcessor],
  exports: [PlaylistService],
})
export class PlaylistModule {}
