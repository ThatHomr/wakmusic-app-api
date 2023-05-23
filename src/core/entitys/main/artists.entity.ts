import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from './group.entity';
import { ArtistImageVersionEntity } from './artistImageVersion.entity';
import { SongsEntity } from './songs.entity';

@Entity({ name: 'artists' })
export class ArtistsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ type: 'bigint' })
  order: number;

  @ApiProperty({ type: String, maxLength: 255, description: '아티스트 id' })
  @Column({ name: 'artist_id', type: 'varchar', length: 255 })
  artistId: string;

  @ApiProperty({ type: String, maxLength: 255, description: '이름' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiProperty({ type: String, maxLength: 255, description: '짧은 이름' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  short: string;

  @ApiProperty({ type: Boolean, description: '졸업 여부' })
  @Column({ type: 'boolean', default: 0 })
  graduated: boolean;

  @ApiProperty({ type: () => GroupEntity })
  @OneToOne(() => GroupEntity, (group) => group.artist)
  group: GroupEntity;

  @ApiProperty({ type: () => SongsEntity, isArray: true })
  @ManyToMany(() => SongsEntity, (song) => song.artists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'artist_song',
    joinColumn: {
      name: 'artist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'song_id',
      referencedColumnName: 'id',
    },
  })
  songs: Array<SongsEntity>;

  @ApiProperty({ type: String, description: '한 줄 소개' })
  @Column({ type: 'longtext', nullable: true })
  title: string;

  @ApiProperty({ type: String, description: '한 줄 소개(앱)' })
  @Column({ name: 'app_title', type: 'longtext', nullable: true })
  appTitle: string;

  @ApiProperty({ type: String, description: '긴 소개글' })
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Transform(({ value }) => value.split(',').map((data) => data.split('|')))
  @ApiProperty({
    type: [[String]],
    maxLength: 255,
    description: 'HEX 색깔 코드',
    example: '5EA585|100|0,5EA585|0|0',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  color: string;

  @ApiProperty({ type: String, maxLength: 255, description: '유튜브 URL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  youtube: string;

  @ApiProperty({ type: String, maxLength: 255, description: '트위치 URL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  twitch: string;

  @ApiProperty({
    type: String,
    maxLength: 255,
    description: '인스타그램 URL',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string;

  @ApiProperty({ type: () => ArtistImageVersionEntity })
  @OneToOne(
    () => ArtistImageVersionEntity,
    (artistImageVersion) => artistImageVersion.artist,
  )
  image: ArtistImageVersionEntity;
}
