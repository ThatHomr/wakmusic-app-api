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
import { UserPlaylistPlaylistsEntity } from './userPlaylistsPlaylists.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_playlists' })
export class UserPlaylistsEntity extends BaseEntity {
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

  @ApiProperty({ type: () => UserPlaylistPlaylistsEntity, isArray: true })
  @OneToMany(
    () => UserPlaylistPlaylistsEntity,
    (playlists) => playlists.userPlaylists,
  )
  playlists: Array<UserPlaylistPlaylistsEntity>;
}
