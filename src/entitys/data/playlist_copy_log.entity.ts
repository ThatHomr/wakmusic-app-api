import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist_copy_log' })
export class PlaylistCopyLogEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty()
  @Column({ type: 'int' })
  date: number;

  @ApiModelProperty()
  @Column({ type: 'tinytext' })
  playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'tinytext' })
  new_playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'text', nullable: true })
  playlist_owner_id: string;

  @ApiModelProperty()
  @Column({ type: 'text', nullable: true })
  new_playlist_owner_id: string;

  @ApiModelProperty()
  @Column({ type: 'bigint' })
  created_at: number;
}
