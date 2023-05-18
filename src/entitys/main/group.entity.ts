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

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiModelProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.group)
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;

  @ApiModelProperty()
  @Column({ type: 'varchar', length: 255 })
  en: string;

  @ApiModelProperty()
  @Column({ type: 'varchar', length: 255 })
  kr: string;
}
