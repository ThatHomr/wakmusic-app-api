import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserLikeSongEntity } from './userLikeSong.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_likes' })
export class UserLikeEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, (user) => user.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @ApiProperty({ type: () => UserLikeSongEntity, isArray: true })
  @OneToMany(() => UserLikeSongEntity, (songs) => songs.userLike, {
    eager: true,
  })
  likes: Array<UserLikeSongEntity>;
}
