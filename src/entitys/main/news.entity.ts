import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'news' })
export class NewsEntity extends BaseEntity {
  @ApiProperty({ type: 'int', description: '카페 게시글 아이디' })
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'text', description: '뉴스 제목' })
  @Column({ type: 'text', nullable: true })
  title: string;

  @ApiProperty({ type: 'int', description: '업로드 주차 + 뉴스 유형' })
  @Column({ type: 'int', nullable: true })
  time: number;

  constructor(partial: Partial<NewsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
