import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'teams' })
export class TeamsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255, description: '소속팀' })
  @Column({ type: 'varchar', length: 255 })
  team: string;

  @ApiProperty({ description: '닉네임' })
  @Column({ type: 'text', nullable: true })
  name: string;

  @ApiProperty({ type: 'varchar', maxLength: 255, description: '맡은 역할' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  role: string;
}
