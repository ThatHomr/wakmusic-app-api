import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'notice' })
export class NoticeEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty()
  @Column({ type: 'tinytext' })
  category: string;

  @ApiModelProperty()
  @Column({ type: 'mediumtext' })
  title: string;

  @ApiModelProperty()
  @Column({ type: 'longtext', nullable: true })
  main_text: string;

  @ApiModelProperty()
  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @ApiModelProperty()
  @Column({ type: 'simple-array' })
  images: Array<string>;

  @ApiModelProperty()
  @Column({ type: 'bigint' })
  create_at: number;

  @ApiModelProperty()
  @Column({ type: 'bigint' })
  start_at: number;

  @ApiModelProperty()
  @Column({ type: 'bigint' })
  end_at: number;
}
