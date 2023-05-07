import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'manager' })
export class LikeManagerEntity extends BaseEntity {
  @ApiProperty({ description: '고유 id' })
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: '유저 id' })
  @Column({ type: 'text' })
  user_id: string;

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  songs: Array<string>;
}
