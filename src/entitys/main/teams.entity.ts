import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Exclude } from 'class-transformer';

@Entity({ name: 'teams' })
export class TeamsEntity extends BaseEntity {
  @ApiModelProperty()
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiModelProperty({ description: '소속팀' })
  @Column({ type: 'varchar' })
  team: string;

  @ApiModelProperty({ description: '닉네임' })
  @Column({ type: 'longtext', nullable: true })
  name: string;

  @ApiModelProperty({ description: '맡은 역할' })
  @Column({ type: 'tinytext', nullable: true })
  role: string;

  constructor(partial: Partial<TeamsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
