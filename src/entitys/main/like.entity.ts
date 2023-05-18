import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongsEntity } from './songs.entity';

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @ApiModelProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: () => SongsEntity })
  @OneToOne(() => SongsEntity, (song) => song.like)
  @JoinColumn({ name: 'song_id' })
  song: SongsEntity;

  @ApiModelProperty({ type: 'bigint' })
  @Column({ type: 'bigint', default: 0 })
  likes: number;
}
