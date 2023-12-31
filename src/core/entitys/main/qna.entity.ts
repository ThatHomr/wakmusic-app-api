import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'qna' })
export class QnaEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => CategoryEntity })
  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoryEntity;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255, unique: true })
  question: string;

  @ApiProperty({ type: String })
  @Column({ type: 'longtext' })
  description: string;

  @ApiProperty({ type: Number, description: 'unix timestamp 형식' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
