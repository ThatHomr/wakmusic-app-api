import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_permissions' })
export class UserPermissionsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, (user) => user.permission, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  type: string;
}
