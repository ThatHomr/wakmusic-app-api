import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'notice' })
export class NoticeEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => CategoriesEntity })
  @ManyToOne(() => CategoriesEntity, (category) => category.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoriesEntity;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: 'longtext' })
  @Column({ name: 'main_text', type: 'longtext', nullable: true })
  mainText: string;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @ApiProperty({ type: 'string', isArray: true })
  @Column({ type: 'simple-array', nullable: true })
  images: Array<string>;

  @ApiProperty({ type: 'int' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;

  @ApiProperty({ type: 'int' })
  @Column({ name: 'start_at', type: 'bigint' })
  startAt: number;

  @ApiProperty({ type: 'int' })
  @Column({ name: 'end_at', type: 'bigint' })
  endAt: number;
}
