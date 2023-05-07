import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist' })
export class RecommendPlaylistEntity extends BaseEntity {
  @ApiModelProperty({ description: '플레이리스트 Id', uniqueItems: true })
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @ApiModelProperty({ description: '플레이리스트 이름' })
  @Column({ type: 'text' })
  title: string;

  @ApiModelProperty({ description: '플레이리스트 노래 목록' })
  @Column({ type: 'simple-array', nullable: true })
  song_ids: Array<string>;

  @ApiModelProperty({ description: '플레이리스트 공개 여부' })
  @Column({ type: 'boolean', default: 0 })
  public: boolean;
}
