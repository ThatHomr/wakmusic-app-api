import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recommended_playlist' })
export class RecommendedPlaylistVersionEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty()
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiModelProperty()
  @Column({ type: 'smallint' })
  round: number;

  @ApiModelProperty()
  @Column({ type: 'smallint' })
  square: number;
}
