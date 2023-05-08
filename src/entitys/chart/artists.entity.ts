import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Exclude } from 'class-transformer';

@Entity({ name: 'artists' })
export class ArtistsEntity extends BaseEntity {
  @ApiModelProperty()
  @Exclude()
  @Column({ unique: true })
  order: number;

  @ApiProperty({ description: '아티스트' })
  @PrimaryColumn({ type: 'varchar', unique: true })
  artist: string;

  @ApiProperty({ description: '아티스트가 참여한 곡들' })
  @Column({ type: 'longtext', nullable: true })
  ids: string;

  constructor(partial: Partial<ArtistsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
