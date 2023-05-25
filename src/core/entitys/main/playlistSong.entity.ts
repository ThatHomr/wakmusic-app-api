import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { SongEntity } from './song.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'playlist_songs' })
export class PlaylistSongEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => PlaylistEntity })
  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.songs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: PlaylistEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'playlist_id', type: 'bigint' })
  playlistId: number;

  @ApiProperty({ type: () => SongEntity })
  @ManyToOne(() => SongEntity, (song) => song.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  order: number;
}
