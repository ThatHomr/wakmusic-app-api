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

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongEntity })
  @OneToOne(() => SongEntity, (song) => song.like, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'song_id', type: 'bigint', unique: true })
  songId: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'bigint', default: 0 })
  likes: number;
}
