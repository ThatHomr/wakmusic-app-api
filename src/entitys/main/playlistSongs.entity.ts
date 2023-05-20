import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { SongsEntity } from './songs.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'playlist_songs' })
export class PlaylistSongsEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: () => PlaylistEntity })
  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.songs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id', referencedColumnName: 'id' })
  playlist: PlaylistEntity;

  @ApiProperty({ type: () => SongsEntity })
  @ManyToOne(() => SongsEntity, (song) => song.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id', referencedColumnName: 'id' })
  song: SongsEntity;

  @Exclude()
  @ApiProperty({ type: 'int' })
  @Column({ type: 'bigint' })
  order: number;
}
