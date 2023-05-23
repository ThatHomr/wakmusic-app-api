import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistsEntity } from '../core/entitys/main/artists.entity';
import { NewsEntity } from '../core/entitys/main/news.entity';
import { TeamsEntity } from '../core/entitys/main/teams.entity';
import { QnaEntity } from '../core/entitys/main/qna.entity';
import { NoticeEntity } from '../core/entitys/main/notice.entity';
import { CategoriesEntity } from '../core/entitys/main/categories.entity';
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
import { PlaylistCopyLogsEntity } from 'src/core/entitys/main/playlistCopyLogs.entity';
import { PlaylistImageEntity } from 'src/core/entitys/main/playlistImage.entity';
import { PlaylistSongsEntity } from 'src/core/entitys/main/playlistSongs.entity';
import { ProfileEntity } from 'src/core/entitys/main/profile.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { RecommendedPlaylistImageEntity } from 'src/core/entitys/main/recommendedPlaylistImage.entity';
import { RecommendedPlaylistSongsEntity } from 'src/core/entitys/main/recommendedPlaylistSongs.entity';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';
import { UserEntity } from 'src/core/entitys/main/user.entity';
import { UserAccessLogsEntity } from 'src/core/entitys/main/userAccessLogs.entity';
import { UserLikesEntity } from 'src/core/entitys/main/userLikes.entity';
import { UserLikesSongsEntity } from 'src/core/entitys/main/userLikesSongs.entity';
import { UserPermissionsEntity } from 'src/core/entitys/main/userPermissions.entity';
import { UserPlaylistsEntity } from 'src/core/entitys/main/userPlaylists.entity';
import { UserPlaylistPlaylistsEntity } from 'src/core/entitys/main/userPlaylistsPlaylists.entity';
import { EventEntity } from 'src/core/entitys/app/event.entity';
import { VersionEntity } from 'src/core/entitys/app/version.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'main',
  entities: [
    ArtistImageVersionEntity,
    ArtistsEntity,
    CategoriesEntity,
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
    PlaylistCopyLogsEntity,
    PlaylistImageEntity,
    PlaylistSongsEntity,
    ProfileEntity,
    QnaEntity,
    RecommendedPlaylistEntity,
    RecommendedPlaylistImageEntity,
    RecommendedPlaylistSongsEntity,
    SongsEntity,
    TeamsEntity,
    UserEntity,
    UserAccessLogsEntity,
    UserLikesEntity,
    UserLikesSongsEntity,
    UserPermissionsEntity,
    UserPlaylistsEntity,
    UserPlaylistPlaylistsEntity,
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
