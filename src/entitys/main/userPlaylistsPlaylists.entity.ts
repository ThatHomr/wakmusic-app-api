import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPlaylistsEntity } from './userPlaylists.entity';
import { PlaylistEntity } from './playlist.entity';

@Entity({ name: 'user_playlists_playlists' })
export class UserPlaylistsPlaylistsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserPlaylistsEntity })
  @ManyToOne(
    () => UserPlaylistsEntity,
    (userPlaylists) => userPlaylists.playlists,
  )
  @JoinColumn({ name: 'user_playlists_id' })
  userPlaylists: UserPlaylistsEntity;

  @ApiProperty({ type: () => PlaylistEntity })
  @OneToOne(() => PlaylistEntity, (playlist) => playlist.id)
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  order: number;
}
