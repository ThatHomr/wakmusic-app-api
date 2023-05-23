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
import { LikeEntity } from './like.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_likes_songs' })
export class UserLikesSongsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserLikesEntity })
  @ManyToOne(() => UserLikesEntity, (userLikes) => userLikes.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_likes_id', referencedColumnName: 'id' })
  userLikes: UserLikesEntity;

  @ApiProperty({ type: () => LikeEntity })
  @ManyToOne(() => LikeEntity, (like) => like.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'like_id', referencedColumnName: 'id' })
  like: LikeEntity;

  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  order: number;
}
