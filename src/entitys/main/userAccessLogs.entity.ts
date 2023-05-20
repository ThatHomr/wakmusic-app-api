import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_access_logs' })
export class UserAccessLogsEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;
}
