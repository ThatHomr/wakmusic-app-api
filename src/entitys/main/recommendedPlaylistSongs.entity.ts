import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecommendedPlaylistEntity } from './recommendedPlaylist.entity';

@Entity({ name: 'recommended_playlist_songs' })
export class RecommendedPlaylistSongsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => RecommendedPlaylistEntity })
  @ManyToOne(() => RecommendedPlaylistEntity, (playlist) => playlist.songs)
  @JoinColumn({ name: 'playlist_id' })
  playlist: RecommendedPlaylistEntity;
}
