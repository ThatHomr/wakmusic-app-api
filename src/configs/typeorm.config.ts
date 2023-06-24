import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistEntity } from '../core/entitys/main/artist.entity';
import { NewsEntity } from '../core/entitys/main/news.entity';
import { TeamEntity } from '../core/entitys/main/team.entity';
import { QnaEntity } from '../core/entitys/main/qna.entity';
import { NoticeEntity } from '../core/entitys/main/notice.entity';
import { CategoryEntity } from '../core/entitys/main/category.entity';
import { ArtistImageVersionEntity } from 'src/core/entitys/main/artistImageVersion.entity';
import { ChartDailyEntity } from 'src/core/entitys/main/chartDaily.entity';
import { ChartHourlyEntity } from 'src/core/entitys/main/chartHourly.entity';
import { ChartMonthlyEntity } from 'src/core/entitys/main/chartMonthly.entity';
import { ChartTotalEntity } from 'src/core/entitys/main/chartTotal.entity';
import { ChartUpdatedEntity } from 'src/core/entitys/main/chartUpdated.entity';
import { ChartWeeklyEntity } from 'src/core/entitys/main/chartWeekly.entity';
import { GroupEntity } from 'src/core/entitys/main/group.entity';
import { LikeEntity } from 'src/core/entitys/main/like.entity';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { PlaylistCopyEntity } from 'src/core/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogEntity } from 'src/core/entitys/main/playlistCopyLog.entity';
import { PlaylistImageEntity } from 'src/core/entitys/main/playlistImage.entity';
import { PlaylistSongEntity } from 'src/core/entitys/main/playlistSong.entity';
import { ProfileEntity } from 'src/core/entitys/main/profile.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { RecommendedPlaylistImageEntity } from 'src/core/entitys/main/recommendedPlaylistImage.entity';
import { RecommendedPlaylistSongEntity } from 'src/core/entitys/main/recommendedPlaylistSong.entity';
import { SongEntity } from 'src/core/entitys/main/song.entity';
import { UserEntity } from 'src/core/entitys/main/user.entity';
import { UserAccessLogEntity } from 'src/core/entitys/main/userAccessLog.entity';
import { UserLikeEntity } from 'src/core/entitys/main/userLike.entity';
import { UserLikeSongEntity } from 'src/core/entitys/main/userLikeSong.entity';
import { UserPermissionEntity } from 'src/core/entitys/main/userPermission.entity';
import { UserPlaylistEntity } from 'src/core/entitys/main/userPlaylist.entity';
import { UserPlaylistPlaylistEntity } from 'src/core/entitys/main/userPlaylistPlaylist.entity';
import { EventEntity } from 'src/core/entitys/app/event.entity';
import { VersionEntity } from 'src/core/entitys/app/version.entity';
import { LyricsEntity } from 'src/core/entitys/main/lyrics.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'main',
  entities: [
    ArtistImageVersionEntity,
    ArtistEntity,
    CategoryEntity,
    ChartDailyEntity,
    ChartHourlyEntity,
    ChartMonthlyEntity,
    ChartTotalEntity,
    ChartUpdatedEntity,
    ChartWeeklyEntity,
    GroupEntity,
    LikeEntity,
    NewsEntity,
    NoticeEntity,
    PlaylistEntity,
    PlaylistCopyEntity,
    PlaylistCopyLogEntity,
    PlaylistImageEntity,
    PlaylistSongEntity,
    ProfileEntity,
    QnaEntity,
    RecommendedPlaylistEntity,
    RecommendedPlaylistImageEntity,
    RecommendedPlaylistSongEntity,
    SongEntity,
    TeamEntity,
    UserEntity,
    UserAccessLogEntity,
    UserLikeEntity,
    UserLikeSongEntity,
    UserPermissionEntity,
    UserPlaylistEntity,
    UserPlaylistPlaylistEntity,
    LyricsEntity,
  ],
  bigNumberStrings: false,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const appDataSource: TypeOrmModuleOptions = {
  name: 'app',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'app',
  entities: [EventEntity, VersionEntity],
  bigNumberStrings: false,
  timezone: process.env.TZ || 'Asia/Seoul',
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};
