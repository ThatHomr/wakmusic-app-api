import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profile' })
export class ProfileVersionEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty()
  @Column({ type: 'tinytext', unique: true })
  type: string;

  @ApiModelProperty()
  @Column({ type: 'smallint' })
  version: number;
}
