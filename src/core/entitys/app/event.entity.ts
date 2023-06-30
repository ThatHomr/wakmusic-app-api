import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'event' })
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ type: Number })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String })
  os: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ type: String })
  description: string;

  @Column({ type: 'bool' })
  @ApiProperty({ type: Boolean })
  active: boolean;

  @Column({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ type: Date })
  createAt: Date;
}
