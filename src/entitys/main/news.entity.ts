import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'news' })
export class NewsEntity extends BaseEntity {
  @ApiProperty({ description: '카페 게시글 아이디' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: '뉴스 제목' })
  @Column({ type: 'text', nullable: true })
  title: string;

  @ApiProperty({ description: '업로드 주차 + 뉴스 유형' })
  @Column({ type: 'bigint', nullable: true })
  time: number;

  constructor(partial: Partial<NewsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
