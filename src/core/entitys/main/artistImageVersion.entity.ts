import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArtistEntity } from './artistEntity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'artist_image_version' })
export class ArtistImageVersionEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => ArtistEntity })
  @OneToOne(() => ArtistEntity, (artist) => artist.image, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: ArtistEntity;

  @ApiProperty({ type: Number, default: 1 })
  @Column({ type: 'int', default: 1 })
  round: number;

  @ApiProperty({ type: Number, default: 1 })
  @Column({ type: 'int', default: 1 })
  square: number;
}
