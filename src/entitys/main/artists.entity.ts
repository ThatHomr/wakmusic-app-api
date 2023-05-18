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
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { GroupEntity } from './group.entity';
import { ArtistImageVersionEntity } from './artistImageVersion.entity';
import { SongsEntity } from './songs.entity';

@Entity({ name: 'artists' })
export class ArtistsEntity extends BaseEntity {
  @ApiModelProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiModelProperty()
  @Exclude()
  @Column()
  order: number;

  @ApiModelProperty({ description: '아티스트 id' })
  @Column({ type: 'varchar', length: 255 })
  artist_id: string;

  @ApiModelProperty({ description: '이름' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiModelProperty({ description: '짧은 이름' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  short: string;

  @ApiModelProperty({ description: '졸업 여부' })
  @Column({ type: 'boolean', default: 0 })
  graduated: boolean;

  @ApiModelProperty({ type: () => GroupEntity })
  @OneToOne(() => GroupEntity, (group) => group.artist)
  group: GroupEntity;

  @ApiModelProperty({ type: () => SongsEntity, isArray: true })
  @ManyToMany(() => SongsEntity, (song) => song.artists)
  @JoinTable({
    name: 'artist_song',
    joinColumn: {
      name: 'artist_id',
    },
    inverseJoinColumn: {
      name: 'song_id',
    },
  })
  songs: Array<SongsEntity>;

  @ApiModelProperty({ description: '한 줄 소개' })
  @Column({ type: 'longtext', nullable: true })
  title: string;

  @ApiModelProperty({ description: '한 줄 소개(앱)' })
  @Column({ type: 'longtext', nullable: true })
  app_title: string;

  @ApiModelProperty({ description: '긴 소개글' })
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @ApiModelProperty({
    description: 'HEX 색깔 코드',
    example: '5EA585|100|0,5EA585|0|0',
  })
  @Transform(({ value }) => value.split(',').map((data) => data.split('|')))
  @Column({ type: 'tinytext', nullable: true })
  color: string;

  @ApiModelProperty({ type: 'text', description: '유튜브 URL' })
  @Column({ type: 'text', nullable: true })
  youtube: string;

  @ApiModelProperty({ description: '트위치 URL' })
  @Column({ type: 'text', nullable: true })
  twitch: string;

  @ApiModelProperty({ description: '인스타그램 URL' })
  @Column({ type: 'text', nullable: true })
  instagram: string;

  @ApiModelProperty({ type: () => ArtistImageVersionEntity })
  @OneToOne(
    () => ArtistImageVersionEntity,
    (artistImageVersion) => artistImageVersion.artist,
  )
  artistImageVersion: ArtistImageVersionEntity;
}
