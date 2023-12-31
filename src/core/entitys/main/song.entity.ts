import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { LikeEntity } from './like.entity';
import { ChartHourlyEntity } from './chartHourly.entity';
import { ChartDailyEntity } from './chartDaily.entity';
import { ChartWeeklyEntity } from './chartWeekly.entity';
import { ChartMonthlyEntity } from './chartMonthly.entity';
import { ChartTotalEntity } from './chartTotal.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'song' })
export class SongEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: String, maxLength: 255, uniqueItems: true })
  @Column({ name: 'song_id', type: 'varchar', length: 255, unique: true })
  songId: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  artist: string;

  @ApiProperty({ type: () => ArtistEntity, isArray: true })
  @ManyToMany(() => ArtistEntity, (artist) => artist.songs, {})
  artists: Array<ArtistEntity>;

  @ApiProperty({ type: () => LikeEntity })
  @OneToOne(() => LikeEntity, (like) => like.song)
  like: LikeEntity;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  remix: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  reaction: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'int' })
  date: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  start: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  end: number;

  @ApiProperty({ type: () => ChartTotalEntity })
  @OneToOne(() => ChartTotalEntity, (total) => total.song)
  total: ChartTotalEntity;

  @ApiProperty({ type: () => ChartHourlyEntity })
  @OneToOne(() => ChartHourlyEntity, (hourly) => hourly.song)
  hourly: ChartHourlyEntity;

  @ApiProperty({ type: () => ChartDailyEntity })
  @OneToOne(() => ChartDailyEntity, (daily) => daily.song)
  daily: ChartDailyEntity;

  @ApiProperty({ type: () => ChartWeeklyEntity })
  @OneToOne(() => ChartWeeklyEntity, (weekly) => weekly.song)
  weekly: ChartWeeklyEntity;

  @ApiProperty({ type: () => ChartMonthlyEntity })
  @OneToOne(() => ChartMonthlyEntity, (monthly) => monthly.song)
  monthly: ChartMonthlyEntity;
}
