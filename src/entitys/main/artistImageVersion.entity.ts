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
import { Exclude } from 'class-transformer';

@Entity({ name: 'artist_image_version' })
export class ArtistImageVersionEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.image, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: ArtistsEntity;

  @ApiProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  round: number;

  @ApiProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  square: number;
}
