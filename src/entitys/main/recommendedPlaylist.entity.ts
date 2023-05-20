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
import { Exclude, Transform } from 'class-transformer';

@Entity({ name: 'recommended_playlist' })
export class RecommendedPlaylistEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Transform(({ value }: { value: Array<RecommendedPlaylistSongsEntity> }) =>
    value.map((song) => song.song),
  )
  @ApiProperty({ type: () => RecommendedPlaylistSongsEntity, isArray: true })
  @OneToMany(() => RecommendedPlaylistSongsEntity, (songs) => songs.playlist)
  songs: Array<RecommendedPlaylistSongsEntity>;

  @ApiProperty({ type: () => RecommendedPlaylistImageEntity })
  @OneToOne(() => RecommendedPlaylistImageEntity, (image) => image.playlist, {
    eager: true,
  })
  image: RecommendedPlaylistImageEntity;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean' })
  public: boolean;

  @ApiProperty({ type: Number })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
