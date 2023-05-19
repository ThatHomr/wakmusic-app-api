import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'chart_updated' })
export class ChartUpdatedEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryColumn({ type: 'bigint' })
  time: number;
}
