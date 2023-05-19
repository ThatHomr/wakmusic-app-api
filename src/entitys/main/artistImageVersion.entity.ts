import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistsEntity } from './artists.entity';

@Entity({ name: 'artist_image_version' })
export class ArtistImageVersionEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.artistImageVersion)
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;

  @ApiProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  round: number;

  @ApiProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  square: number;
}
