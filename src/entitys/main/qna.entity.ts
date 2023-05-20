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
import { Exclude } from 'class-transformer';

@Entity({ name: 'qna' })
export class QnaEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => CategoriesEntity })
  @ManyToOne(() => CategoriesEntity, (category) => category.id, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoriesEntity;

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
