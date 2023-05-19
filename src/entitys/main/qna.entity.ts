import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriesEntity } from './categories.entity';

@Entity({ name: 'qna' })
export class QnaEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => CategoriesEntity })
  @ManyToOne(() => CategoriesEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: CategoriesEntity;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, unique: true })
  question: string;

  @ApiProperty({ type: 'longtext' })
  @Column({ type: 'longtext' })
  description: string;

  @ApiProperty({ type: 'bigint', description: 'unix timestamp 형식' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
