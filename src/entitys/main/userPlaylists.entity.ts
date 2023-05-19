import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPlaylistsPlaylistsEntity } from './userPlaylistsPlaylists.entity';

@Entity({ name: 'user_playlists' })
export class UserPlaylistsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, (user) => user.playlists)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ type: () => UserPlaylistsPlaylistsEntity, isArray: true })
  @ManyToOne(
    () => UserPlaylistsPlaylistsEntity,
    (playlists) => playlists.userPlaylists,
  )
  playlists: Array<UserPlaylistsPlaylistsEntity>;
}
