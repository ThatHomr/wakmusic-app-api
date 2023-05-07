import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'playlist_v2' })
export class PlaylistEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: '플레이리스트 고유 key' })
  @Column({ type: 'text', unique: true })
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  @Column({ type: 'text' })
  title: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  @Column({ type: 'mediumtext' })
  creator_id: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  @Column({ type: 'tinytext' })
  image: string;

  @ApiProperty({ description: '플레이리스트 노래 목록' })
  @Column({ type: 'simple-array', nullable: true })
  songlist: Array<string>;

  constructor(partial: Partial<PlaylistEntity>) {
    super();
    Object.assign(this, partial);
  }
}
