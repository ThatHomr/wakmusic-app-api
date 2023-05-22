import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'version' })
export class VersionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ type: Number })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String })
  os: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ type: String })
  version: string;

  @Column({ type: 'bool', default: 0 })
  @ApiProperty({ type: Boolean })
  force: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP()' })
  @ApiProperty({ type: Date })
  create_at: Date;
}
