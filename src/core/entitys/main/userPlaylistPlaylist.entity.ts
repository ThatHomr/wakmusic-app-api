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
import { UserPlaylistEntity } from './userPlaylist.entity';
import { PlaylistEntity } from './playlist.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_playlist_playlists' })
export class UserPlaylistPlaylistEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserPlaylistEntity })
  @ManyToOne(
    () => UserPlaylistEntity,
    (userPlaylists) => userPlaylists.playlists,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'user_playlists_id', referencedColumnName: 'id' })
  userPlaylist: UserPlaylistEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'user_playlists_id', type: 'bigint' })
  userPlaylistId: number;

  @ApiProperty({ type: () => PlaylistEntity })
  @OneToOne(() => PlaylistEntity, (playlist) => playlist.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: PlaylistEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'playlist_id', type: 'bigint' })
  playlistId: number;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  order: number;
}
