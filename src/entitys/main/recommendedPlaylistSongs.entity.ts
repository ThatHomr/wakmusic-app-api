import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecommendedPlaylistEntity } from './recommendedPlaylist.entity';
import { SongsEntity } from './songs.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'recommended_playlist_songs' })
export class RecommendedPlaylistSongsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => RecommendedPlaylistEntity })
  @ManyToOne(() => RecommendedPlaylistEntity, (playlist) => playlist.songs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: RecommendedPlaylistEntity;

  @ApiProperty({ type: () => SongsEntity })
  @ManyToOne(() => SongsEntity, (song) => song.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongsEntity;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'bigint' })
  order: number;
}
