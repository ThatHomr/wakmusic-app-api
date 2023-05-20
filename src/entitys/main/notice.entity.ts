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
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => CategoriesEntity })
  @ManyToOne(() => CategoriesEntity, (category) => category.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoriesEntity;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: String })
  @Column({ name: 'main_text', type: 'longtext', nullable: true })
  mainText: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @ApiProperty({ type: [String], isArray: true })
  @Column({ type: 'simple-array', nullable: true })
  images: Array<string>;

  @ApiProperty({ type: Number })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;

  @ApiProperty({ type: Number })
  @Column({ name: 'start_at', type: 'bigint' })
  startAt: number;

  @ApiProperty({ type: Number })
  @Column({ name: 'end_at', type: 'bigint' })
  endAt: number;
}
