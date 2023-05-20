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

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => ArtistsEntity })
  @OneToOne(() => ArtistsEntity, (artist) => artist.group, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
  artist: ArtistsEntity;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  en: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  kr: string;
}
