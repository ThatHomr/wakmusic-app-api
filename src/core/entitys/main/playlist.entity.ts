import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PlaylistImageEntity } from './playlistImage.entity';
import { PlaylistSongEntity } from './playlistSong.entity';
import { Exclude, Transform } from 'class-transformer';

@Entity({ name: 'playlist' })
export class PlaylistEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ApiProperty({ type: () => PlaylistImageEntity })
  @ManyToOne(() => PlaylistImageEntity, (image) => image.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image: PlaylistImageEntity;

  @Transform(({ value }: { value: Array<PlaylistSongEntity> }) =>
    value.map((song) => song.song),
  )
  @ApiProperty({ type: () => PlaylistSongEntity, isArray: true })
  @OneToMany(() => PlaylistSongEntity, (songs) => songs.playlist)
  songs: Array<PlaylistSongEntity>;

  @ApiProperty({ type: Number })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
