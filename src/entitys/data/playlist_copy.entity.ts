import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist_copy' })
export class PlaylistCopyEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  date: number;

  @ApiModelProperty()
  @Column({ type: 'tinytext', nullable: true })
  playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'text', nullable: true })
  owner_id: string;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  count: number;
}
