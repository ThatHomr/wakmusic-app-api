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
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_playlist_playlists' })
export class UserPlaylistPlaylistsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserPlaylistsEntity })
  @ManyToOne(
    () => UserPlaylistsEntity,
    (userPlaylists) => userPlaylists.playlists,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'user_playlists_id', referencedColumnName: 'id' })
  userPlaylists: UserPlaylistsEntity;

  @ApiProperty({ type: () => PlaylistEntity })
  @OneToOne(() => PlaylistEntity, (playlist) => playlist.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: PlaylistEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  order: number;
}
