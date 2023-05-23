import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { SongsService } from '../songs/songs.service';
import { PlaylistEditDto } from './dto/playlist-edit.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { moment } from '../utils/moment.utils';
import { Cache } from 'cache-manager';
import { PlaylistAddSongsResponseDto } from './dto/response/playlist-add-songs.response.dto';
import { PlaylistJobDto } from './dto/playlist-job.dto';
import { PlaylistEntity } from 'src/core/entitys/main/playlist.entity';
import { RecommendedPlaylistEntity } from 'src/core/entitys/main/recommendedPlaylist.entity';
import { UserPlaylistsEntity } from 'src/core/entitys/main/userPlaylists.entity';
import { PlaylistImageEntity } from 'src/core/entitys/main/playlistImage.entity';
import { UserService } from 'src/user/user.service';
import { PlaylistSongsEntity } from 'src/core/entitys/main/playlistSongs.entity';
import { UserPlaylistPlaylistsEntity } from 'src/core/entitys/main/userPlaylistsPlaylists.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectQueue('playlist')
    private playlistQueue: Queue<PlaylistJobDto>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @Inject(SongsService)
    private readonly songsService: SongsService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(PlaylistSongsEntity)
    private readonly playlistSongsRepository: Repository<PlaylistSongsEntity>,
    @InjectRepository(RecommendedPlaylistEntity)
    private readonly recommendedPlaylistRepository: Repository<RecommendedPlaylistEntity>,
    @InjectRepository(UserPlaylistsEntity)
    private readonly userPlaylistRepository: Repository<UserPlaylistsEntity>,
    @InjectRepository(UserPlaylistPlaylistsEntity)
    private readonly userPlaylistPlaylistsRepository: Repository<UserPlaylistPlaylistsEntity>,
    @InjectRepository(PlaylistImageEntity)
    private readonly playlistImageRepository: Repository<PlaylistImageEntity>,
  ) {}

  async findAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {},
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
      order: {
        songs: {
          order: 'ASC',
        },
      },
    });
  }

  async findOne(id: string): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: id,
      },
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
      order: {
        songs: {
          order: 'ASC',
        },
      },
    });
  }

  async getDetail(key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistRepository.findOne({
      where: {
        key: key,
      },
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
      order: {
        songs: {
          order: 'ASC',
        },
      },
    });
    if (!playlist) return null;

    return playlist;
  }

  async findAllPlaylistRecommended(): Promise<
    Array<RecommendedPlaylistEntity>
  > {
    return await this.recommendedPlaylistRepository.find({
      where: {
        public: true,
      },
    });
  }

  async findPlaylistRecommended(
    key: string,
  ): Promise<RecommendedPlaylistEntity> {
    const playlist = await this.recommendedPlaylistRepository.findOne({
      where: {
        key: key,
        public: true,
      },
      order: {
        songs: {
          order: 'asc',
        },
      },
      relations: {
        songs: {
          song: {
            total: true,
          },
        },
      },
    });
    if (!playlist) throw new BadRequestException('playlist not exist');

    return playlist;
  }

  async findOneByKeyAndClientId(
    key: string,
    clientId: string,
  ): Promise<PlaylistEntity> {
    return await this.playlistRepository.findOne({
      where: {
        key: key,
        user: {
          userId: clientId,
        },
      },
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
    });
  }

  async findByKeysAndClientId(
    keys: Array<string>,
    clientId: string,
  ): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {
        user: {
          userId: clientId,
        },
        key: In(keys),
      },
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
    });
  }

  async findByClientId(clientId: string): Promise<Array<PlaylistEntity>> {
    return await this.playlistRepository.find({
      where: {
        user: {
          userId: clientId,
        },
      },
      relations: {
        user: {
          profile: true,
        },
        image: true,
        songs: {
          song: {
            total: true,
          },
        },
      },
    });
  }

  async create(
    id: string,
    body: PlaylistCreateBodyDto,
  ): Promise<PlaylistEntity> {
    const limit = 20;
    let key: string;
    for (let i = 0; i <= limit; i++) {
      key = this.createKey();
      const duplicateCheck = await this.findOne(key);
      if (!duplicateCheck) {
        break;
      }
      if (i == limit) return null;
    }

    const user = await this.userService.findOneById(id);
    const image = await this.playlistImageRepository.findOne({
      where: {
        name: body.image,
      },
    });

    const newPlaylist = this.playlistRepository.create();

    newPlaylist.key = key;
    newPlaylist.title = body.title;
    newPlaylist.user = user;
    newPlaylist.image = image;
    newPlaylist.songs = [];
    newPlaylist.createAt = moment().valueOf();

    const savedPlaylist = await this.playlistRepository.save(newPlaylist);
    if (body.songlist) await this.createSongList(savedPlaylist, body.songlist);

    await this.addPlaylistToUserPlaylists(id, savedPlaylist);

    return savedPlaylist;
  }

  private createKey(num = 10) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < num; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async createSongList(
    playlist: PlaylistEntity,
    songIds: Array<string>,
  ): Promise<Array<PlaylistSongsEntity>> {
    if (songIds.length === 0) return [];

    const songs = await this.songsService.findByIds(songIds);
    let results: Array<PlaylistSongsEntity> = [];

    for (let i = 0; i < songs.length; i++) {
      const newPlaylistSongsEntity = this.playlistSongsRepository.create({
        playlist: playlist,
        song: songs[i + 1],
      });
      results.push(newPlaylistSongsEntity);
    }

    results = await Promise.all(
      results.map((playlistSongsEntity) =>
        this.playlistSongsRepository.save(playlistSongsEntity),
      ),
    );

    return results;
  }

  async addSongsToPlaylist(
    userId: string,
    key: string,
    songIds: Array<string>,
  ): Promise<PlaylistAddSongsResponseDto> {
    const playlistEntity = await this.findOneByKeyAndClientId(key, userId);
    if (!playlistEntity) throw new BadRequestException('invaild playlist');

    const checkSongIds = await this.songsService.checkSongs(songIds);
    if (!checkSongIds) throw new BadRequestException('invaild song ids');

    const playlistSongIds = playlistEntity.songs.map(
      (song) => song.song.songId,
    );

    let duplicated = false;

    const validSongIds = songIds.filter(
      (songId) => !playlistSongIds.includes(songId),
    );
    if (validSongIds.length !== songIds.length) duplicated = true;

    const addedSongs = await this.createPlaylistSongs(
      playlistEntity,
      validSongIds,
    );
    if (addedSongs.length == 0) throw new BadRequestException('no songs added');

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${userId}) /api/user/playlists`);

    return {
      status: 200,
      addedSongsLength: addedSongs.length,
      duplicated: duplicated,
    };
  }

  async createPlaylistSongs(
    playlist: PlaylistEntity,
    songIds: Array<string>,
  ): Promise<Array<PlaylistSongsEntity>> {
    const prevMaxOrder =
      playlist.songs.length !== 0
        ? playlist.songs.reduce((prev, current) =>
            prev.order > current.order ? prev : current,
          ).order
        : 0;
    const playlistSongEntitys = [];
    const songs = await this.songsService.findByIds(songIds);

    for (let i = 0; i < songIds.length; i++) {
      const playlistSongEntity = this.playlistSongsRepository.create({
        playlist: playlist,
        song: songs[i],
        order: prevMaxOrder + i + 1,
      });
      playlistSongEntitys.push(playlistSongEntity);
    }

    return await Promise.all(
      playlistSongEntitys.map((playlistSongEntity) =>
        this.playlistSongsRepository.save(playlistSongEntity),
      ),
    );
  }

  // async removeSongsToPlaylist(
  //   userId: string,
  //   key: string,
  //   songIds: Array<string>,
  // ): Promise<void> {
  //   const playlist = await this.findOneByKeyAndClientId(key, userId);
  //   if (!playlist) throw new BadRequestException('invaild playlist');

  //   for (const songId of songIds) {
  //     if (!playlist.songlist.includes(songId))
  //       throw new BadRequestException('song not exist');

  //     const songIdx = playlist.songlist.indexOf(songId);
  //     if (songIdx <= -1) throw new BadRequestException('song not exist');

  //     playlist.songlist.splice(songIdx, 1);
  //   }

  //   await this.playlistRepository.save(playlist);

  //   await this.cacheManager.del(`/api/playlist/${key}/detail`);
  //   await this.cacheManager.del(`(${userId}) /api/user/playlists`);
  // }

  async edit(
    id: string,
    key: string,
    body: PlaylistEditDto,
  ): Promise<PlaylistEntity> {
    const currentPlaylist = await this.findOneByKeyAndClientId(key, id);
    if (!currentPlaylist)
      throw new NotFoundException('플레이리스트가 없습니다.');

    if (body.title) currentPlaylist.title = body.title;

    if (body.songs) {
      const isValid = await this.songsService.checkSongs(body.songs);
      if (!isValid) throw new BadRequestException('invalid songs.');

      if (currentPlaylist.songs.length < body.songs.length)
        throw new BadRequestException('too many songs.');

      const result = currentPlaylist.songs.reduce<{
        delete: Array<PlaylistSongsEntity>;
        edit: Array<PlaylistSongsEntity>;
      }>(
        (obj, current) => {
          if (!body.songs.includes(current.song.songId)) {
            obj.delete.push(current);
          } else {
            obj.edit.push(current);
          }
          return obj;
        },
        {
          delete: [],
          edit: [],
        },
      );

      const newSongEntitys: Array<PlaylistSongsEntity> = [];
      for (let i = 0; i < body.songs.length; i++) {
        const song = result.edit.find((value) =>
          value.song.songId === body.songs[i] ? true : undefined,
        );
        song.order = i + 1;
        newSongEntitys.push(song);
      }

      await this.playlistSongsRepository.remove(result.delete);
      currentPlaylist.songs = await this.playlistSongsRepository.save(
        newSongEntitys,
      );
    }

    await this.playlistRepository.update(
      {
        id: currentPlaylist.id,
      },
      {
        title: currentPlaylist.title,
      },
    );

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${id}) /api/user/playlists`);

    return currentPlaylist;
  }

  async delete(key: string, clientId: string): Promise<PlaylistEntity> {
    const playlist = await this.findOneByKeyAndClientId(key, clientId);

    if (!playlist) throw new NotFoundException('playlist not found');

    const deletedPlaylist = await this.playlistRepository.remove(playlist);

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${clientId}) /api/user/playlists`);

    return deletedPlaylist;
  }

  async deleteMany(keys: Array<string>): Promise<void> {
    await this.playlistRepository.delete({
      key: In(keys),
    });

    await Promise.all(
      keys.map((key) => this.cacheManager.del(`/api/playlist/${key}/detail`)),
    );
  }

  async addToMyPlaylist(
    key: string,
    creatorId: string,
  ): Promise<PlaylistEntity> {
    const playlist = await this.findOne(key);
    if (!playlist) throw new NotFoundException();
    if (playlist.user.userId == creatorId)
      throw new BadRequestException(
        '개인의 플레이리스트는 추가할 수 없습니다.',
      );
    const newPlaylist = await this.create(creatorId, {
      title: playlist.title,
      image: playlist.image.name,
      songlist: playlist.songs.map((song) => song.song.songId),
    });

    await this.playlistQueue.add(
      'add_to_my_playlist',
      {
        playlist_key: playlist.key,
        new_playlist_key: newPlaylist.key,
        playlist_owner_id: playlist.user.userId,
        new_playlist_owner_id: creatorId,
        datetime: moment().valueOf(),
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return newPlaylist;
  }

  async findUserPlaylistsByUserId(id: string): Promise<UserPlaylistsEntity> {
    let userPlaylists = await this.userPlaylistRepository
      .createQueryBuilder('userPlaylist')
      .leftJoinAndSelect('userPlaylist.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('userPlaylist.playlists', 'playlists')
      .leftJoinAndSelect('playlists.playlist', 'playlist')
      .where('user.userId = :id', { id: id })
      .orderBy('playlists.order', 'ASC')
      .getOne();
    if (!userPlaylists) userPlaylists = await this.createUserPlaylists(id);

    return userPlaylists;
  }

  async createUserPlaylists(id: string): Promise<UserPlaylistsEntity> {
    const user = await this.userService.findOneById(id);
    const newUserPlaylists = this.userPlaylistRepository.create();
    newUserPlaylists.user = user;
    newUserPlaylists.playlists = [];

    return await this.userPlaylistRepository.save(newUserPlaylists);
  }

  async createUserPlaylistPlaylists(
    userPlaylistsEntity: UserPlaylistsEntity,
    newPlaylist: PlaylistEntity,
  ): Promise<UserPlaylistPlaylistsEntity> {
    const order =
      userPlaylistsEntity.playlists.length !== 0
        ? userPlaylistsEntity.playlists.reduce((prev, current) =>
            prev.order > current.order ? prev : current,
          ).order
        : 0;

    const userPlaylistPlaylistsEntity =
      this.userPlaylistPlaylistsRepository.create({
        userPlaylists: userPlaylistsEntity,
        playlist: newPlaylist,
        order: order + 1,
      });

    return await this.userPlaylistPlaylistsRepository.save(
      userPlaylistPlaylistsEntity,
    );
  }

  async addPlaylistToUserPlaylists(
    id: string,
    playlist: PlaylistEntity,
  ): Promise<void> {
    const userPlaylistsEntity = await this.findUserPlaylistsByUserId(id);
    const userPlaylists = userPlaylistsEntity.playlists.map(
      (playlist) => playlist.playlist,
    );
    if (userPlaylists.includes(playlist))
      throw new BadRequestException('이미 추가되어있는 플레이리스트 입니다.');

    await this.createUserPlaylistPlaylists(userPlaylistsEntity, playlist);
    await this.cacheManager.del(`(${id}) /api/user/playlists`);
  }

  async editUserPlaylists(id: string, playlists: Array<string>): Promise<void> {
    await this.validateEditUserPlaylists(id, playlists);
    const userPlaylistsEntity = await this.findUserPlaylistsByUserId(id);
    const userPlaylistPlaylistsEntitys = userPlaylistsEntity.playlists;
    const userPlaylists = userPlaylistsEntity.playlists.map(
      (playlist) => playlist.playlist.key,
    );

    for (let i = 0; i < playlists.length; i++) {
      const playlistIdx = userPlaylists.indexOf(playlists[i]);
      userPlaylistPlaylistsEntitys[playlistIdx].order = i + 1;
    }

    await this.userPlaylistPlaylistsRepository.save(
      userPlaylistPlaylistsEntitys,
    );

    await this.cacheManager.del(`(${id}) /api/user/playlists`);
  }

  async validateEditUserPlaylists(
    id: string,
    playlists: Array<string>,
  ): Promise<void> {
    const userPlaylists = await this.findByKeysAndClientId(playlists, id);
    if (userPlaylists.length !== playlists.length)
      throw new BadRequestException('존재하지 않는 플레이리스트 입니다.');
  }

  async deleteUserPlaylists(
    userId: string,
    playlistKeys: Array<string>,
  ): Promise<void> {
    await this.validateDeleteUserPlaylists(userId, playlistKeys);

    await this.deleteMany(playlistKeys);

    await this.cacheManager.del(`(${userId}) /api/user/playlists`);
  }

  async validateDeleteUserPlaylists(
    id: string,
    playlistKeys: Array<string>,
  ): Promise<void> {
    const userPlaylists = await this.findByKeysAndClientId(playlistKeys, id);
    if (userPlaylists.length !== playlistKeys.length)
      throw new BadRequestException('존재하지 않는 플레이리스트 입니다.');
  }
}
