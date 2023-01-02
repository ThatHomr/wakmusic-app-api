import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { TotalEntity } from './total.entity';

@Entity({ name: 'monthly' })
export class MonthlyEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  songId: string;

  @Column()
  increase: number;

  @Column()
  last: number;

  @OneToOne(() => TotalEntity, (total) => total.id)
  @JoinColumn()
  total: TotalEntity;

  constructor(partial: Partial<MonthlyEntity>) {
    super();
    Object.assign(this, partial);
  }
}
