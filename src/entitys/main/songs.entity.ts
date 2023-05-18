import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistsEntity } from './artists.entity';
import { LikeEntity } from './like.entity';

@Entity({ name: 'songs' })
export class SongsEntity extends BaseEntity {
  @ApiModelProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'varchar', maxLength: 255, uniqueItems: true })
  @Column({ name: 'song_id', type: 'varchar', length: 255, unique: true })
  songId: string;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  artist: string;

  @ApiModelProperty({ type: () => ArtistsEntity, isArray: true })
  @ManyToMany(() => ArtistsEntity, (artist) => artist.songs)
  artists: Array<ArtistsEntity>;

  @ApiModelProperty({ type: () => LikeEntity })
  @OneToOne(() => LikeEntity, (like) => like.song)
  like: LikeEntity;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  remix: string;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  reaction: string;

  @ApiModelProperty({ type: 'int' })
  @Column({ type: 'int' })
  date: number;

  @ApiModelProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  start: number;

  @ApiModelProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  end: number;
}
