import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'playlist_copy_logs' })
export class PlaylistCopyLogsEntity extends BaseEntity {
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  date: number;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ name: 'playlist_key', type: 'varchar', length: 255 })
  playlistKey: string;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ name: 'new_playlist_key', type: 'varchar', length: 255 })
  newPlaylistKey: string;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ name: 'playlist_owner_id', type: 'varchar', length: 255 })
  playlistOwnerId: string;

  @ApiProperty({ type: 'text', maxLength: 255 })
  @Column({ name: 'new_playlist_owner_id', type: 'varchar', length: 255 })
  newPlaylistOwnerId: string;

  @ApiProperty({ type: 'int' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
