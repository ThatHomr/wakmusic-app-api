import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistsEntity } from '../entitys/chart/artists.entity';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { UpdatedEntity } from '../entitys/chart/updated.entity';
import { TotalEntity } from '../entitys/chart/total.entity';
import { MonthlyEntity } from '../entitys/chart/monthly.entity';
import { WeeklyEntity } from '../entitys/chart/weekly.entity';
import { DailyEntity } from '../entitys/chart/daily.entity';
import { HourlyEntity } from '../entitys/chart/hourly.entity';
import { NewsEntity } from '../entitys/main/news.entity';
import { TeamsEntity } from '../entitys/main/teams.entity';
import { rootPath } from '../utils/path.utils';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { UserEntity } from '../entitys/user/user.entity';
import { LikeEntity } from '../entitys/like/like.entity';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { QnaEntity } from '../entitys/main/qna.entity';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesEntity } from '../entitys/main/categories.entity';
import { UserPlaylistsEntity } from '../entitys/user/user-playlists.entity';
import { PlaylistCopyEntity } from '../entitys/data/playlist_copy.entity';
import { PlaylistCopyLogEntity } from '../entitys/data/playlist_copy_log.entity';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';
import { PlaylistVersionEntity } from '../entitys/version/playlist.entity';
import { RecommendedPlaylistVersionEntity } from '../entitys/version/recommended-playlist.entitiy';
import { ProfileVersionEntity } from 'src/entitys/version/profile.entity';

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
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const chartDataSource: TypeOrmModuleOptions = {
  name: 'chart',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'charts',
  entities: [
    ArtistsEntity,
    UpdatedEntity,
    TotalEntity,
    MonthlyEntity,
    WeeklyEntity,
    DailyEntity,
    HourlyEntity,
  ],
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const userDataSource: TypeOrmModuleOptions = {
  name: 'user',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'user',
  entities: [PlaylistEntity, UserEntity, UserPlaylistsEntity],
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const likeDataSource: TypeOrmModuleOptions = {
  name: 'like',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'like',
  entities: [LikeEntity, LikeManagerEntity, RecommendPlaylistEntity],
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const dataDataSource: TypeOrmModuleOptions = {
  name: 'data',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'data',
  entities: [PlaylistCopyEntity, PlaylistCopyLogEntity],
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};

export const versionDataSource: TypeOrmModuleOptions = {
  name: 'version',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: 'version',
  entities: [
    ArtistVersionEntity,
    PlaylistVersionEntity,
    RecommendedPlaylistVersionEntity,
    ProfileVersionEntity,
  ],
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
};
