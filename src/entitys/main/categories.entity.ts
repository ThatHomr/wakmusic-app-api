import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'categories' })
export class CategoriesEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  type: string;

  @ApiModelProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  category: string;
}
