import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'qna' })
export class QnaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  category: string;

  @ApiProperty()
  @Column({ type: 'mediumtext', unique: true })
  question: string;

  @ApiProperty()
  @Column({ type: 'longtext' })
  description: string;

  @ApiProperty({ description: 'timestamp 형식' })
  @Column({ type: 'bigint' })
  create_at: number;
}
