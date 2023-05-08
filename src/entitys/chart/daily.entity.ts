import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Exclude } from 'class-transformer';

@Entity({ name: 'daily' })
export class DailyEntity extends BaseEntity {
  @ApiProperty({ description: '음악 id' })
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @ApiModelProperty()
  @Exclude()
  @Column({ type: 'int', nullable: true })
  views: number;

  @ApiProperty({ description: '증가량' })
  @Column({ type: 'mediumint', nullable: true })
  increase: number;

  @ApiProperty({ description: '지난 번 집계 순위' })
  @Column({ type: 'int', nullable: true })
  last: number;

  constructor(partial: Partial<DailyEntity>) {
    super();
    Object.assign(this, partial);
  }
}
