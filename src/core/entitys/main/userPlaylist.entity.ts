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
import { UserPlaylistPlaylistEntity } from './userPlaylistPlaylist.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_playlists' })
export class UserPlaylistEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, (user) => user.playlists, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @ApiProperty({ type: () => UserPlaylistPlaylistEntity, isArray: true })
  @OneToMany(
    () => UserPlaylistPlaylistEntity,
    (playlists) => playlists.userPlaylist,
  )
  playlists: Array<UserPlaylistPlaylistEntity>;
}
