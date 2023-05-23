import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserLikesSongsEntity } from './userLikesSongs.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_likes' })
export class UserLikesEntity extends BaseEntity {
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

  @ApiProperty({ type: () => UserLikesSongsEntity, isArray: true })
  @OneToMany(() => UserLikesSongsEntity, (songs) => songs.userLikes, {
    eager: true,
  })
  likes: Array<UserLikesSongsEntity>;
}
