import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongsEntity } from './songs.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'chart_hourly' })
export class ChartHourlyEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongsEntity })
  @OneToOne(() => SongsEntity, (song) => song.hourly)
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongsEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  views: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  increase: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  last: number;
}
