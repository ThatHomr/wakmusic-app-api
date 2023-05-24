import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { OauthDto } from '../auth/dto/oauth.dto';
import { JwtPayload } from '../auth/auth.service';
import * as process from 'process';
import { PlaylistService } from '../playlist/playlist.service';
import { LikeService } from '../like/like.service';
import { EditUserLikesBodyDto } from './dto/body/edit-user-likes.body.dto';
import { EditUserPlaylistsBodyDto } from './dto/body/edit-user-playlists.body.dto';
import { Cache } from 'cache-manager';
import { DeleteUserPlaylistsBodyDto } from './dto/body/delete-user-playlists.body.dto';
import { DeleteUserLikesBodyDto } from './dto/body/delete-user-likes.body.dto';
import { UserEntity } from 'src/core/entitys/main/user.entity';
import { ProfileEntity } from 'src/core/entitys/main/profile.entity';
import { moment } from '../utils/moment.utils';
import { LikeEntity } from 'src/core/entitys/main/like.entity';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { UserPlaylistsEntity } from 'src/core/entitys/main/userPlaylists.entity';
import { UserPermissionsEntity } from 'src/core/entitys/main/userPermissions.entity';
import { UserAccessLogsEntity } from 'src/core/entitys/main/userAccessLogs.entity';
import { UserLikesEntity } from 'src/core/entitys/main/userLikes.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly playlistService: PlaylistService,
    private readonly likeService: LikeService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAccessLogsEntity)
    private readonly userAccessLogRepository: Repository<UserAccessLogsEntity>,
    @InjectRepository(UserPlaylistsEntity)
    private readonly userPlaylistsRepository: Repository<UserPlaylistsEntity>,
    @InjectRepository(UserLikesEntity)
    private readonly userLikesRepository: Repository<UserLikesEntity>,
    @InjectRepository(UserPermissionsEntity)
    private readonly userPermissionsRepository: Repository<UserPermissionsEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findOneById(
    id: string,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
      relations: relations || {
        profile: true,
      },
    });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return user;
  }
  async findByProviderIdOrSave(OAuthUser: OauthDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: {
        userId: OAuthUser.id,
        platform: OAuthUser.provider,
      },
      relations: {
        profile: true,
      },
    });

    if (!user) user = await this.create(OAuthUser);

    return user;
  }

  async create(OAuthUser: OauthDto): Promise<UserEntity> {
    const profile = await this.profileRepository.findOne({
      where: {
        type: 'panchi',
      },
    });
    if (!profile)
      throw new InternalServerErrorException('failed to find profile entity.');

    const newUser = this.userRepository.create();
    newUser.userId = OAuthUser.id;
    newUser.displayName = process.env.DEFAULT_NAME;
    newUser.platform = OAuthUser.provider;
    newUser.profile = profile;
    newUser.firstLoginTime = moment().valueOf();
    newUser.createAt = moment().valueOf();

    let user: UserEntity;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user = await queryRunner.manager.save(newUser);
      if (!user)
        throw new InternalServerErrorException('failed to create new user.');

      const userPermissions = this.userPermissionsRepository.create({
        user: user,
        type: 'default',
      });
      const userPlaylists = this.userPlaylistsRepository.create({
        user: user,
        playlists: [],
      });
      const userLikes = this.userLikesRepository.create({
        user: user,
        likes: [],
      });
      await queryRunner.manager.insert(UserPermissionsEntity, userPermissions);
      await queryRunner.manager.insert(UserPlaylistsEntity, userPlaylists);
      await queryRunner.manager.insert(UserLikesEntity, userLikes);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (!user)
      throw new InternalServerErrorException('failed to create new user.');

    return user;
  }

  async createAccessLog(user: UserEntity): Promise<void> {
    const log = this.userAccessLogRepository.create({
      user: user,
      createdAt: moment().valueOf(),
    });

    await this.userAccessLogRepository.save(log);
  }

  async getProfileImages(): Promise<Array<ProfileEntity>> {
    return this.profileRepository.find();
  }

  async setProfile(id: string, image: string): Promise<void> {
    const user = await this.findOneById(id);
    const newProfile = await this.profileRepository.findOne({
      where: {
        type: image,
      },
    });

    user.profile = newProfile;

    await this.userRepository.save(user);
    this.cacheManager.del(`(${id}) /api/auth`);
  }

  async setUsername(id: string, username: string): Promise<void> {
    const user = await this.findOneById(id);
    user.displayName = username;

    await this.userRepository.save(user);
    this.cacheManager.del(`(${id}) /api/auth`);
  }

  checkFirstLogin(firstLoginTime: number): boolean {
    const now = moment().format('YYYY MM DD');
    const firstLogin = moment.unix(firstLoginTime).format('YYYY MM DD');

    return now == firstLogin;
  }

  async remove(user: JwtPayload): Promise<boolean> {
    const targetUser = await this.userRepository.findOne({
      where: {
        userId: user.id,
      },
      relations: {
        playlists: {
          playlists: true,
        },
        likes: true,
        permission: true,
      },
    });
    if (!targetUser) throw new NotFoundException('유저가 없습니다.');

    await this.userRepository.delete({
      id: targetUser.id,
    });

    return true;
  }

  async getUserPlaylists(id: string): Promise<Array<PlaylistEntity>> {
    const playlistKeys = (
      await this.playlistService.findUserPlaylistsByUserId(id)
    ).playlists.map((playlist) => playlist.playlist.key);

    const unsortedPlaylistsDetail =
      await this.playlistService.findByKeysAndClientId(playlistKeys, id);

    const sortedPlaylists: Map<number, PlaylistEntity> = new Map();

    for (const playlist of unsortedPlaylistsDetail) {
      const idx = playlistKeys.indexOf(playlist.key);
      if (idx < 0) throw new InternalServerErrorException();

      sortedPlaylists.set(idx, playlist);
    }

    return Array.from(
      new Map([...sortedPlaylists].sort(this.handleUserPlaylistsSort)).values(),
    );
  }

  private handleUserPlaylistsSort(
    a: [number, PlaylistEntity],
    b: [number, PlaylistEntity],
  ): number {
    return a[0] - b[0];
  }

  async editUserPlaylists(
    id: string,
    body: EditUserPlaylistsBodyDto,
  ): Promise<void> {
    await this.playlistService.editUserPlaylists(id, body.playlists);
  }

  async deleteUserPlaylists(
    id: string,
    body: DeleteUserPlaylistsBodyDto,
  ): Promise<void> {
    await this.playlistService.deleteUserPlaylists(id, body.playlists);
  }

  async getUserLikes(id: string): Promise<Array<LikeEntity>> {
    const userLikes = await this.likeService.getUserLikes(id);
    return userLikes.likes.map((likes) => likes.like);
  }

  async editUserLikes(id: string, body: EditUserLikesBodyDto): Promise<void> {
    await this.likeService.editUserLikes(id, body.songs);
  }

  async deleteUserLikes(
    userId: string,
    body: DeleteUserLikesBodyDto,
  ): Promise<void> {
    await this.likeService.deleteUserLikes(userId, body.songs);
  }
}
