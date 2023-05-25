import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongEntity } from './song.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'chart_hourly' })
export class ChartHourlyEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongEntity })
  @OneToOne(() => SongEntity, (song) => song.daily, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongEntity;

  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  views: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'int' })
  increase: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'int' })
  last: number;
}
