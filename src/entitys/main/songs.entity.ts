import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistsEntity } from './artists.entity';
import { LikeEntity } from './like.entity';
import { ChartHourlyEntity } from './chartHourly.entity';
import { ChartDailyEntity } from './chartDaily.entity';
import { ChartWeeklyEntity } from './chartWeekly.entity';
import { ChartMonthlyEntity } from './chartMonthly.entity';

@Entity({ name: 'songs' })
export class SongsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255, uniqueItems: true })
  @Column({ name: 'song_id', type: 'varchar', length: 255, unique: true })
  songId: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  artist: string;

  @ApiProperty({ type: () => ArtistsEntity, isArray: true })
  @ManyToMany(() => ArtistsEntity, (artist) => artist.songs)
  artists: Array<ArtistsEntity>;

  @ApiProperty({ type: () => LikeEntity })
  @OneToOne(() => LikeEntity, (like) => like.song)
  like: LikeEntity;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  remix: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  reaction: string;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  date: number;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  start: number;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  end: number;

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
