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

@Entity({ name: 'chart_weekly' })
export class ChartWeeklyEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongsEntity })
  @OneToOne(() => SongsEntity, (song) => song.weekly)
  @JoinColumn({ name: 'song_id' })
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
