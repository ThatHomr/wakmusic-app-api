import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { UserPlaylistEntity } from 'src/core/entitys/main/userPlaylist.entity';
import { UserPermissionEntity } from 'src/core/entitys/main/userPermission.entity';
import { UserAccessLogEntity } from 'src/core/entitys/main/userAccessLog.entity';
import { UserLikeEntity } from 'src/core/entitys/main/userLike.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly playlistService: PlaylistService,
    private readonly likeService: LikeService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAccessLogEntity)
    private readonly userAccessLogRepository: Repository<UserAccessLogEntity>,
    @InjectRepository(UserPlaylistEntity)
    private readonly userPlaylistRepository: Repository<UserPlaylistEntity>,
    @InjectRepository(UserLikeEntity)
    private readonly userLikeRepository: Repository<UserLikeEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
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
    if (!profile) {
      this.logger.error('failed to find profile entity.');
      throw new InternalServerErrorException('unexpected error occurred.');
    }

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
      await queryRunner.manager.insert(UserEntity, newUser);
      user = await queryRunner.manager.findOne(UserEntity, {
        relations: { profile: true },
        where: {
          userId: newUser.userId,
        },
      });
      if (!user) {
        this.logger.error('failed to create new user.');
        throw new InternalServerErrorException('failed to create new user.');
      }

      const userPermissions = this.userPermissionRepository.create({
        user: user,
        type: 'default',
      });
      const userPlaylists = this.userPlaylistRepository.create({
        user: user,
        playlists: [],
      });
      const userLikes = this.userLikeRepository.create({
        user: user,
        likes: [],
      });
      await queryRunner.manager.insert(UserPermissionEntity, userPermissions);
      await queryRunner.manager.insert(UserPlaylistEntity, userPlaylists);
      await queryRunner.manager.insert(UserLikeEntity, userLikes);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (!user) {
      this.logger.error('failed to create new user.');
      throw new InternalServerErrorException('failed to create new user.');
    }

    return user;
  }

  async createAccessLog(user: UserEntity): Promise<void> {
    const log = this.userAccessLogRepository.create({
      user: user,
      createdAt: moment().valueOf(),
    });

    await this.userAccessLogRepository.insert(log);
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

    await this.userRepository.update(
      { id: user.id },
      { profileId: newProfile.id },
    );
    await this.cacheManager.del(`(${id}) /api/auth`);
  }

  async setUsername(id: string, username: string): Promise<void> {
    const user = await this.findOneById(id);

    await this.userRepository.update(
      { id: user.id },
      { displayName: username },
    );
    await this.cacheManager.del(`(${id}) /api/auth`);
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
      if (idx < 0) {
        this.logger.error('error while sorting songs.');
        throw new InternalServerErrorException('unexpected error occurred.');
      }

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
