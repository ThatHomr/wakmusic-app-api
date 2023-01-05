import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { main, chart } from '../../typeorm.config.json';
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
import { root } from '../utils/path.utils';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { UserEntity } from '../entitys/user/user.entity';

export const mainDataSource: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: `${root}/db/static.db`,
  entities: [NewsEntity, TeamsEntity, MainArtistsEntity],
  // synchronize: true,
};

export const chartDataSource: TypeOrmModuleOptions = {
  name: 'chart',
  type: 'sqlite',
  database: `${root}/db/charts.db`,
  entities: [
    ArtistsEntity,
    UpdatedEntity,
    TotalEntity,
    MonthlyEntity,
    WeeklyEntity,
    DailyEntity,
    HourlyEntity,
  ],
  // synchronize: true,
};

export const userDataSource: TypeOrmModuleOptions = {
  name: 'user',
  type: 'sqlite',
  database: `${root}/db/user.db`,
  entities: [PlaylistEntity, UserEntity],
};
