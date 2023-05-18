import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { NewsEntity } from '../entitys/main/news.entity';
import { TeamsEntity } from '../entitys/main/teams.entity';
import { QnaEntity } from '../entitys/main/qna.entity';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesEntity } from '../entitys/main/categories.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'static',
  entities: [
    NewsEntity,
    TeamsEntity,
    MainArtistsEntity,
    QnaEntity,
    NoticeEntity,
    CategoriesEntity,
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
