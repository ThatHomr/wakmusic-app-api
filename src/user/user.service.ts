import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { Repository } from 'typeorm';
import { OauthDto } from '../auth/dto/oauth.dto';
import { JwtPayload } from '../auth/auth.service';
import * as process from 'process';
import { PlaylistService } from '../playlist/playlist.service';
import { SongsService } from '../songs/songs.service';
import { LikeDto } from '../like/dto/like.dto';
import { LikeService } from '../like/like.service';
import { EditUserLikesBodyDto } from './dto/body/edit-user-likes.body.dto';
import { EditUserPlaylistsBodyDto } from './dto/body/edit-user-playlists.body.dto';
import { Cache } from 'cache-manager';
import { ImageService } from 'src/image/image.service';
import { GetUserPlaylistsResponseDto } from './dto/response/get-user-playlists.response.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { GetProfileImagesResponseDto } from './dto/response/get-profile-images.response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly playlistService: PlaylistService,
    private readonly likeService: LikeService,
    private readonly songsService: SongsService,
    private readonly imageService: ImageService,
    private readonly categoriesService: CategoriesService,

    @InjectRepository(UserEntity, 'user')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return user;
  }
  async findByProviderIdOrSave(OAuthUser: OauthDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: {
        id: OAuthUser.id,
        platform: OAuthUser.provider,
      },
    });

    if (!user) user = await this.create(OAuthUser);

    return user;
  }

  async create(OAuthUser: OauthDto): Promise<UserEntity> {
    const newUser = this.userRepository.create();
    newUser.id = OAuthUser.id;
    newUser.displayName = process.env.DEFAULT_NAME;
    newUser.platform = OAuthUser.provider;
    newUser.profile = 'panchi';
    newUser.first_login_time = Date.now();

    const user = await this.userRepository.save(newUser);
    if (!user) throw new InternalServerErrorException();

    return user;
  }

  async getProfileImages(): Promise<Array<GetProfileImagesResponseDto>> {
    const categories = await this.categoriesService.findCategoriesByType(
      'profile',
    );
    const unsorted_profile_versions =
      await this.imageService.getAllProfileImageVersion();

    const sorted_profile_image: Map<number, GetProfileImagesResponseDto> =
      new Map();

    for (const profile of unsorted_profile_versions) {
      const idx = categories.indexOf(profile.type);
      if (idx < 0) throw new InternalServerErrorException();

      sorted_profile_image.set(idx, {
        type: profile.type,
        version: profile.version,
      });
    }

    return Array.from(
      new Map([...sorted_profile_image].sort((a, b) => a[0] - b[0])).values(),
    );
  }

  async setProfile(id: string, image: string): Promise<void> {
    const user = await this.findOneById(id);

    user.profile = image;

    await this.userRepository.save(user);
  }

  async setUsername(id: string, username: string): Promise<void> {
    const user = await this.findOneById(id);
    user.displayName = username;

    await this.userRepository.save(user);
  }

  checkFirstLogin(first_login_time: number): boolean {
    const now = new Date();
    const first_login = new Date(first_login_time);

    return now.toDateString() == first_login.toDateString();
  }

  async remove(user: JwtPayload): Promise<boolean> {
    const targetUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!targetUser) throw new NotFoundException('유저가 없습니다.');

    await this.userRepository.remove(targetUser);

    return true;
  }

  async getUserPlaylists(
    id: string,
  ): Promise<Array<GetUserPlaylistsResponseDto>> {
    const playlists = await this.playlistService.findUserPlaylistsByUserId(id);
    const unsorted_playlists_detail =
      await this.playlistService.findByKeysAndClientId(playlists.playlists, id);
    const playlist_image_versions = await (
      await this.imageService.getAllPlaylistImageVersion()
    )
      .map((image) => [parseInt(image.type), image.default])
      .sort((a, b) => a[0] - b[0]);

    const sorted_playlists_detail: Map<number, GetUserPlaylistsResponseDto> =
      new Map();

    for (const playlist of unsorted_playlists_detail) {
      const idx = playlists.playlists.indexOf(playlist.key);
      if (idx < 0) throw new InternalServerErrorException();

      sorted_playlists_detail.set(idx, {
        ...playlist,
        image_version: playlist_image_versions[parseInt(playlist.image) - 1][1],
      });
    }

    return Array.from(
      new Map(
        [...sorted_playlists_detail].sort(this.handleUserPlaylistsSort),
      ).values(),
    );
  }

  private handleUserPlaylistsSort(
    a: [number, GetUserPlaylistsResponseDto],
    b: [number, GetUserPlaylistsResponseDto],
  ): number {
    return a[0] - b[0];
  }

  async editUserPlaylists(
    id: string,
    body: EditUserPlaylistsBodyDto,
  ): Promise<void> {
    await this.playlistService.editUserPlaylists(id, body.playlists);
  }

  async getUserLikes(id: string): Promise<Array<LikeDto>> {
    const manager = await this.likeService.getManager(id);
    return await this.likeService.findByIds(manager.songs);
  }

  async editUserLikes(id: string, body: EditUserLikesBodyDto): Promise<void> {
    await this.likeService.editManager(id, body);
  }
}
