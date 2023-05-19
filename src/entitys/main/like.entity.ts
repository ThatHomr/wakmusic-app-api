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

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongsEntity })
  @OneToOne(() => SongsEntity, (song) => song.like)
  @JoinColumn({ name: 'song_id' })
  song: SongsEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint', default: 0 })
  likes: number;
}
