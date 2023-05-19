import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecommendedPlaylistEntity } from './recommendedPlaylist.entity';

@Entity({ name: 'recommended_playlist_image' })
export class RecommendedPlaylistImageEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => RecommendedPlaylistEntity })
  @OneToOne(() => RecommendedPlaylistEntity, (playlist) => playlist.image)
  @JoinColumn({ name: 'playlist_id' })
  playlist: RecommendedPlaylistEntity;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  round: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  square: number;
}
