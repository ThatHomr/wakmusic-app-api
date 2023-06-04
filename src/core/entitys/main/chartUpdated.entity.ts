import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'chart_updated' })
export class ChartUpdatedEntity extends BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255, unique: true })
  type: string;

  @ApiProperty({ type: Number })
  @PrimaryColumn({ type: 'bigint' })
  time: number;
}
