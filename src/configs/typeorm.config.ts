import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistsEntity } from '../entitys/main/artists.entity';
import { NewsEntity } from '../entitys/main/news.entity';
import { TeamsEntity } from '../entitys/main/teams.entity';
import { QnaEntity } from '../entitys/main/qna.entity';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesEntity } from '../entitys/main/categories.entity';
import { ArtistImageVersionEntity } from 'src/entitys/main/artistImageVersion.entity';
import { ChartDailyEntity } from 'src/entitys/main/chartDaily.entity';
import { ChartHourlyEntity } from 'src/entitys/main/chartHourly.entity';
import { ChartMonthlyEntity } from 'src/entitys/main/chartMonthly.entity';
import { ChartTotalEntity } from 'src/entitys/main/chartTotal.entity';
import { ChartUpdatedEntity } from 'src/entitys/main/chartUpdated.entity';
import { ChartWeeklyEntity } from 'src/entitys/main/chartWeekly.entity';
import { GroupEntity } from 'src/entitys/main/group.entity';
import { LikeEntity } from 'src/entitys/main/like.entity';
import { PlaylistEntity } from 'src/entitys/main/playlist.entity';
import { PlaylistCopyEntity } from 'src/entitys/main/playlistCopy.entity';
import { PlaylistCopyLogsEntity } from 'src/entitys/main/playlistCopyLogs.entity';
import { PlaylistImageEntity } from 'src/entitys/main/playlistImage.entity';
import { PlaylistSongsEntity } from 'src/entitys/main/playlistSongs.entity';
import { ProfileEntity } from 'src/entitys/main/profile.entity';
import { RecommendedPlaylistEntity } from 'src/entitys/main/recommendedPlaylist.entity';
import { RecommendedPlaylistImageEntity } from 'src/entitys/main/recommendedPlaylistImage.entity';
import { RecommendedPlaylistSongsEntity } from 'src/entitys/main/recommendedPlaylistSongs.entity';
import { SongsEntity } from 'src/entitys/main/songs.entity';
import { UserEntity } from 'src/entitys/main/user.entity';
import { UserAccessLogsEntity } from 'src/entitys/main/userAccessLogs.entity';
import { UserLikesEntity } from 'src/entitys/main/userLikes.entity';
import { UserLikesSongsEntity } from 'src/entitys/main/userLikesSongs.entity';
import { UserPermissionsEntity } from 'src/entitys/main/userPermissions.entity';
import { UserPlaylistsEntity } from 'src/entitys/main/userPlaylists.entity';
import { UserPlaylistsPlaylistsEntity } from 'src/entitys/main/userPlaylistsPlaylists.entity';

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
    UserPlaylistsPlaylistsEntity,
  ],
  bigNumberStrings: false,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

// export const chartDataSource: TypeOrmModuleOptions = {
//   name: 'chart',
//   type: 'mariadb',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   database: 'charts',
//   entities: [
//     ArtistsEntity,
//     UpdatedEntity,
//     TotalEntity,
//     MonthlyEntity,
//     WeeklyEntity,
//     DailyEntity,
//     HourlyEntity,
//   ],
//   bigNumberStrings: false,
//   synchronize: process.env.DB_SYNC === 'true' ? true : false,
// };

// export const userDataSource: TypeOrmModuleOptions = {
//   name: 'user',
//   type: 'mariadb',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   database: 'user',
//   entities: [PlaylistEntity, UserEntity, UserPlaylistsEntity],
//   bigNumberStrings: false,
//   synchronize: process.env.DB_SYNC === 'true' ? true : false,
// };

// export const likeDataSource: TypeOrmModuleOptions = {
//   name: 'like',
//   type: 'mariadb',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   database: 'like',
//   entities: [LikeEntity, LikeManagerEntity, RecommendPlaylistEntity],
//   bigNumberStrings: false,
//   synchronize: process.env.DB_SYNC === 'true' ? true : false,
// };

// export const dataDataSource: TypeOrmModuleOptions = {
//   name: 'data',
//   type: 'mariadb',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   database: 'data',
//   entities: [PlaylistCopyEntity, PlaylistCopyLogEntity],
//   bigNumberStrings: false,
//   synchronize: process.env.DB_SYNC === 'true' ? true : false,
// };

// export const versionDataSource: TypeOrmModuleOptions = {
//   name: 'version',
//   type: 'mariadb',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   database: 'version',
//   entities: [
//     ArtistVersionEntity,
//     PlaylistVersionEntity,
//     RecommendedPlaylistVersionEntity,
//     ProfileVersionEntity,
//   ],
//   bigNumberStrings: false,
//   synchronize: process.env.DB_SYNC === 'true' ? true : false,
// };
