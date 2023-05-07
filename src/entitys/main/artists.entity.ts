import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity({ name: 'artists' })
export class MainArtistsEntity extends BaseEntity {
  @ApiProperty({ description: '아티스트 id' })
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @ApiProperty({ description: '이름' })
  @Column({ type: 'text', nullable: true })
  name: string;

  @ApiProperty({ description: '짧은 이름' })
  @Column({ type: 'text', nullable: true })
  short: string;

  @ApiProperty({ description: '소속 그룹' })
  @Column({ type: 'text', nullable: true })
  group: string;

  @ApiProperty({ description: '소속 그룹(한글)' })
  @Column({ type: 'text', nullable: true })
  group_kr: string;

  @ApiProperty({ description: '졸업 여부' })
  @Column({ type: 'boolean', default: 0 })
  graduated: boolean;

  @ApiProperty({ description: '한 줄 소개' })
  @Column({ type: 'longtext', nullable: true })
  title: string;

  @ApiProperty({ description: '한 줄 소개(앱)' })
  @Column({ type: 'longtext', nullable: true })
  app_title: string;

  @ApiProperty({ description: '긴 소개글' })
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @ApiProperty({
    description: 'HEX 색깔 코드',
    example: '5EA585|100|0,5EA585|0|0',
  })
  @Transform(({ value }) => value.split(',').map((data) => data.split('|')))
  @Column({ type: 'tinytext', nullable: true })
  color: string;

  @ApiProperty({ description: '유튜브 URL' })
  @Column({ type: 'text', nullable: true })
  youtube: string;

  @ApiProperty({ description: '트위치 URL' })
  @Column({ type: 'text', nullable: true })
  twitch: string;

  @ApiProperty({ description: '인스타그램 URL' })
  @Column({ type: 'text', nullable: true })
  instagram: string;

  constructor(partial: Partial<MainArtistsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
