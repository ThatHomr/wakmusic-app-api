import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'playlist_image' })
export class PlaylistImageEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ type: Number })
  @Column({ type: 'int' })
  version: number;
}
