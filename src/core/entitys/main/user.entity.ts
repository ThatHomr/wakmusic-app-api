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
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Exclude()
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Exclude()
  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Exclude()
  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  platform: string;

  @ApiProperty({ type: () => ProfileEntity })
  @ManyToOne(() => ProfileEntity, (profile) => profile.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  profile: ProfileEntity;

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'profile_id', type: 'bigint' })
  profileId: number;

  @ApiProperty({ type: String, maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Exclude()
  @ApiProperty({ type: Number })
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

  @Exclude()
  @ApiProperty({ type: Number })
  @Column({ name: 'create_at', type: 'bigint' })
  createAt: number;
}
