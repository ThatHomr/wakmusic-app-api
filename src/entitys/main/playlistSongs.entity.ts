import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { SongsEntity } from './songs.entity';

@Entity({ name: 'playlist_songs' })
export class PlaylistSongsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => PlaylistEntity })
  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.songs)
  @JoinColumn({ name: 'playlist_id' })
  playlist: PlaylistEntity;

  @ApiProperty({ type: () => SongsEntity })
  @ManyToOne(() => SongsEntity, (song) => song.id)
  @JoinColumn({ name: 'song_id' })
  song: SongsEntity;
}
