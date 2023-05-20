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
import { Exclude } from 'class-transformer';

@Entity({ name: 'recommended_playlist_image' })
export class RecommendedPlaylistImageEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => RecommendedPlaylistEntity })
  @OneToOne(() => RecommendedPlaylistEntity, (playlist) => playlist.image, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: RecommendedPlaylistEntity;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  round: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  square: number;
}
