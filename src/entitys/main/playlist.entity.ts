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
import { PlaylistSongsEntity } from './playlistSongs.entity';

@Entity({ name: 'playlist' })
export class PlaylistEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ type: () => PlaylistImageEntity })
  @ManyToOne(() => PlaylistImageEntity, (image) => image.id)
  @JoinColumn({ name: 'image_id' })
  image: PlaylistImageEntity;

  @ApiProperty({ type: () => PlaylistSongsEntity, isArray: true })
  @OneToMany(() => PlaylistSongsEntity, (songs) => songs.playlist)
  songs: Array<PlaylistSongsEntity>;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
