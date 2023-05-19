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

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.group)
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistsEntity;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  en: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  kr: string;
}
