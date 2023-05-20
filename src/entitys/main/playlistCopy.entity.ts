import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistEntity } from './playlist.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'playlist_copy' })
export class PlaylistCopyEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'int' })
  @Column({ type: 'int' })
  date: number;

  @ApiProperty({ type: () => PlaylistEntity })
  @OneToOne(() => PlaylistEntity, (playlist) => playlist.key, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'playlist_key', referencedColumnName: 'key' })
  playlist: PlaylistEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner: UserEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ type: 'bigint' })
  count: number;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
