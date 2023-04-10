import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'notice' })
export class NoticeEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  category: string;

  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty()
  @Column({ type: 'text' })
  main_text: string;

  @ApiModelProperty()
  @Column('simple-array')
  images: Array<string>;

  @ApiModelProperty()
  @Column()
  create_at: number;

  @ApiModelProperty()
  @Column({ type: 'int' })
  start_at: number;

  @ApiModelProperty()
  @Column({ type: 'int' })
  end_at: number;
}
