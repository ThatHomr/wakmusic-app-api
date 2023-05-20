import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'playlist_image' })
export class PlaylistImageEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  version: number;
}
