import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
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
  @ApiModelProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiModelProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.artistImageVersion)
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;

  @ApiModelProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  round: number;

  @ApiModelProperty({ type: 'int', default: 1 })
  @Column({ type: 'int', default: 1 })
  square: number;
}
