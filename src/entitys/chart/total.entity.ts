import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'total' })
export class TotalEntity extends BaseEntity {
  @ApiProperty({ description: '음악 id', uniqueItems: true })
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @ApiProperty({ description: '제목' })
  @Column({ type: 'mediumtext', nullable: true })
  title: string;

  @ApiProperty({ description: '아티스트' })
  @Column({ type: 'text', nullable: true })
  artist: string;

  @ApiProperty({ description: '조교', default: '' })
  @Column({ type: 'text', default: '' })
  remix: string;

  @ApiProperty({ description: '반응영상 URL', default: '' })
  @Column({ type: 'text', default: '' })
  reaction: string;

  @ApiProperty({ description: '업로드 날짜' })
  @Column({ type: 'int', nullable: true })
  date: number;

  @ApiProperty({ description: '조회수' })
  @Column({ type: 'int', nullable: true })
  views: number;

  @ApiProperty({ description: '지난 번 집계 순위' })
  @Column({ type: 'int', nullable: true })
  last: number;

  constructor(partial: Partial<TotalEntity>) {
    super();
    Object.assign(this, partial);
  }
}
