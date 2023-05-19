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
import { ProfileEntity } from './profile.entity';
import { UserLikesEntity } from './userLikes.entity';
import { UserPermissionsEntity } from './userPermissions.entity';
import { UserPlaylistsEntity } from './userPlaylists.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ type: 'bigint' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  platform: string;

  @ApiProperty({ type: () => ProfileEntity })
  @ManyToOne(() => ProfileEntity, (profile) => profile.id)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;

  @ApiProperty({ type: 'varchar', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'first_login_time', type: 'bigint' })
  firstLoginTime: number;

  @ApiProperty({ type: () => UserPlaylistsEntity })
  @OneToOne(() => UserPlaylistsEntity, (playlists) => playlists.user)
  playlists: UserPlaylistsEntity;

  @ApiProperty({ type: () => UserLikesEntity })
  @OneToOne(() => UserLikesEntity, (likes) => likes.user)
  likes: UserLikesEntity;

  @ApiProperty({ type: () => UserPermissionsEntity })
  @OneToOne(() => UserPermissionsEntity, (permission) => permission.user)
  permission: UserPermissionsEntity;

  @ApiProperty({ type: 'bigint' })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
