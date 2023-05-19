import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecommendedPlaylistImageEntity } from './recommendedPlaylistImage.entity';
import { RecommendedPlaylistSongsEntity } from './recommendedPlaylistSongs.entity';

@Entity({ name: 'recommended_playlist' })
export class RecommendedPlaylistEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: () => RecommendedPlaylistSongsEntity, isArray: true })
  @OneToMany(() => RecommendedPlaylistSongsEntity, (songs) => songs.playlist)
  songs: Array<RecommendedPlaylistSongsEntity>;

  @ApiProperty({ type: () => RecommendedPlaylistImageEntity })
  @OneToOne(() => RecommendedPlaylistImageEntity, (image) => image.playlist)
  image: RecommendedPlaylistImageEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
