import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'categories' })
export class CategoriesEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  type: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  category: string;
}
