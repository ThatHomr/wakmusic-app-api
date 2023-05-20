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

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => SongsEntity })
  @OneToOne(() => SongsEntity, (song) => song.like, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongsEntity;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'bigint', default: 0 })
  likes: number;
}
