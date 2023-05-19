import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLikesEntity } from './userLikes.entity';
import { SongsEntity } from './songs.entity';

@Entity({ name: 'user_likes_songs' })
export class UserLikesSongsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserLikesEntity })
  @ManyToOne(() => UserLikesEntity, (userLikes) => userLikes.songs)
  @JoinColumn({ name: 'user_likes_id' })
  userLikes: UserLikesEntity;

  @ApiProperty({ type: () => SongsEntity })
  @ManyToOne(() => SongsEntity, (song) => song.id)
  @JoinColumn({ name: 'song_id' })
  song: SongsEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  order: number;
}
