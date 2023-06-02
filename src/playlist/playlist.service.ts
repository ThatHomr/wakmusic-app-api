import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
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
import { UserPlaylistEntity } from 'src/core/entitys/main/userPlaylist.entity';
import { PlaylistImageEntity } from 'src/core/entitys/main/playlistImage.entity';
import { UserService } from 'src/user/user.service';
import { PlaylistSongEntity } from 'src/core/entitys/main/playlistSong.entity';
import { UserPlaylistPlaylistEntity } from 'src/core/entitys/main/userPlaylistPlaylist.entity';
import { SongEntity } from 'src/core/entitys/main/song.entity';
import { getError } from 'src/utils/error.utils';

@Injectable()
export class PlaylistService {
  private logger = new Logger(PlaylistService.name);

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
    @InjectRepository(PlaylistSongEntity)
    private readonly playlistSongRepository: Repository<PlaylistSongEntity>,
    @InjectRepository(RecommendedPlaylistEntity)
    private readonly recommendedPlaylistRepository: Repository<RecommendedPlaylistEntity>,
    @InjectRepository(UserPlaylistEntity)
    private readonly userPlaylistRepository: Repository<UserPlaylistEntity>,
    @InjectRepository(UserPlaylistPlaylistEntity)
    private readonly userPlaylistPlaylistRepository: Repository<UserPlaylistPlaylistEntity>,
    @InjectRepository(PlaylistImageEntity)
    private readonly playlistImageRepository: Repository<PlaylistImageEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
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

  async create(
    id: string,
    body: PlaylistCreateBodyDto,
    songs?: Array<SongEntity>,
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

    const user = await this.userService.findOneById(id, {
      profile: true,
      playlists: {
        playlists: true,
      },
    });
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

    let savedPlaylist: PlaylistEntity;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(PlaylistEntity, newPlaylist);
      savedPlaylist = await queryRunner.manager.findOne(PlaylistEntity, {
        where: { key: key },
      });

      if (songs) {
        const playlistSongs: Array<PlaylistSongEntity> = [];
        let idx = 0;
        for (const song of songs) {
          idx += 1;
          playlistSongs.push(
            this.playlistSongRepository.create({
              playlist: savedPlaylist,
              song: song,
              order: idx,
            }),
          );
        }
        await queryRunner.manager.insert(PlaylistSongEntity, playlistSongs);
      }
      // await this.createSongList(savedPlaylist, body.songlist);
      let userPlaylists = user.playlists;
      if (!userPlaylists) {
        const playlists = this.userPlaylistRepository.create({
          user: user,
          playlists: [],
        });
        await queryRunner.manager.insert(UserPlaylistEntity, playlists);
        userPlaylists = await queryRunner.manager.findOne(UserPlaylistEntity, {
          where: { userId: user.id },
        });
      }
      const order =
        userPlaylists.playlists.length !== 0
          ? userPlaylists.playlists.reduce((prev, current) =>
              prev.order > current.order ? prev : current,
            ).order
          : 0;
      const userPlaylistsPlaylistEntity =
        this.userPlaylistPlaylistRepository.create({
          userPlaylist: userPlaylists,
          playlist: savedPlaylist,
          order: order + 1,
        });

      await queryRunner.manager.insert(
        UserPlaylistPlaylistEntity,
        userPlaylistsPlaylistEntity,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      this.logger.error(getError(err));
      throw new InternalServerErrorException('failed to create playlist.');
    } finally {
      await queryRunner.release();
    }

    if (!savedPlaylist) {
      this.logger.error(getError('failed to create playlist.'));
      throw new InternalServerErrorException('failed to create playlist.');
    }

    await this.cacheManager.del(`(${user.userId}) /api/user/playlists`);

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

  async addSongsToPlaylist(
    userId: string,
    key: string,
    songIds: Array<string>,
  ): Promise<PlaylistAddSongsResponseDto> {
    const playlistEntity = await this.findOneByKeyAndClientId(key, userId);
    if (!playlistEntity) throw new BadRequestException('invalid playlist');

    const checkSongIds = await this.songsService.checkSongs(songIds);
    if (!checkSongIds) throw new BadRequestException('invalid song ids');

    const playlistSongIds = playlistEntity.songs.map(
      (song) => song.song.songId,
    );

    let duplicated = false;

    const validSongIds = songIds.filter(
      (songId) => !playlistSongIds.includes(songId),
    );
    if (validSongIds.length !== songIds.length) duplicated = true;

    const addedSongsCount = await this.createPlaylistSongs(
      playlistEntity,
      validSongIds,
    );
    if (addedSongsCount == 0) throw new BadRequestException('no songs added');

    await this.cacheManager.del(`/api/playlist/${key}/detail`);
    await this.cacheManager.del(`(${userId}) /api/user/playlists`);

    return {
      status: 200,
      addedSongsLength: addedSongsCount,
      duplicated: duplicated,
    };
  }

  async createPlaylistSongs(
    playlist: PlaylistEntity,
    songIds: Array<string>,
  ): Promise<number> {
    const prevMaxOrder =
      playlist.songs.length !== 0
        ? playlist.songs.reduce((prev, current) =>
            prev.order > current.order ? prev : current,
          ).order
        : 0;

    const playlistSongEntities: Array<Partial<PlaylistSongEntity>> = [];
    const songs = await this.songsService.findByIds(songIds);

    const playlistId = playlist.id;
    for (let i = 0; i < songIds.length; i++) {
      playlistSongEntities.push({
        playlistId: playlistId,
        song: songs[i],
        order: prevMaxOrder + i + 1,
      });
    }

    const insertResult = await this.playlistSongRepository.insert(
      playlistSongEntities,
    );

    return insertResult.generatedMaps.length;
  }

  // async removeSongsToPlaylist(
  //   userId: string,
  //   key: string,
  //   songIds: Array<string>,
  // ): Promise<void> {
  //   const playlist = await this.findOneByKeyAndClientId(key, userId);
  //   if (!playlist) throw new BadRequestException('invalid playlist');

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

    const newSongEntities: Array<PlaylistSongEntity> = [];
    let deleteSongs: Array<PlaylistSongEntity>;

    if (body.title) currentPlaylist.title = body.title;

    if (body.songs) {
      const isValid = await this.songsService.checkSongs(body.songs);
      if (!isValid) throw new BadRequestException('invalid songs.');

      if (currentPlaylist.songs.length < body.songs.length)
        throw new BadRequestException('too many songs.');

      const result = currentPlaylist.songs.reduce<{
        delete: Array<PlaylistSongEntity>;
        edit: Array<PlaylistSongEntity>;
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

      deleteSongs = result.delete;

      for (let i = 0; i < body.songs.length; i++) {
        const song = result.edit.find((value) =>
          value.song.songId === body.songs[i] ? true : undefined,
        );
        song.order = i + 1;
        newSongEntities.push(song);
      }
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (body.songs) {
        await queryRunner.manager.remove(deleteSongs);
        for (const song of newSongEntities) {
          await queryRunner.manager.update(
            PlaylistSongEntity,
            {
              id: song.id,
            },
            { order: song.order },
          );
        }
        currentPlaylist.songs = await queryRunner.manager.find(
          PlaylistSongEntity,
          {
            relations: { song: { total: true } },
            where: { playlistId: currentPlaylist.id },
          },
        );
      }
      await queryRunner.manager.update(
        PlaylistEntity,
        {
          id: currentPlaylist.id,
        },
        {
          title: currentPlaylist.title,
        },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      this.logger.error(getError(err));
      throw new InternalServerErrorException('failed to save edited playlist.');
    } finally {
      await queryRunner.release();
    }

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
    const newPlaylist = await this.create(
      creatorId,
      {
        title: playlist.title,
        image: playlist.image.name,
      },
      playlist.songs.map((song) => song.song),
    );
    if (newPlaylist === null) {
      this.logger.error(
        getError('Failed to create playlist. please try again.'),
      );
      throw new InternalServerErrorException(
        'Failed to create playlist. please try again.',
      );
    }

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

  async findUserPlaylistsByUserId(id: string): Promise<UserPlaylistEntity> {
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

  async createUserPlaylists(id: string): Promise<UserPlaylistEntity> {
    const user = await this.userService.findOneById(id);
    const newUserPlaylists = this.userPlaylistRepository.create();
    newUserPlaylists.user = user;
    newUserPlaylists.playlists = [];

    await this.userPlaylistRepository.insert(newUserPlaylists);
    return await this.userPlaylistRepository.findOne({
      relations: {
        user: {
          profile: true,
        },
        playlists: {
          playlist: {
            songs: {
              song: {
                total: true,
              },
            },
          },
        },
      },
      where: {
        userId: user.id,
      },
    });
  }

  async editUserPlaylists(id: string, playlists: Array<string>): Promise<void> {
    await this.validateEditUserPlaylists(id, playlists);
    const userPlaylistsEntity = await this.findUserPlaylistsByUserId(id);
    const userPlaylistPlaylistsEntities = userPlaylistsEntity.playlists;
    const userPlaylists = userPlaylistsEntity.playlists.map(
      (playlist) => playlist.playlist.key,
    );

    const orderData: Array<[number, number]> = [];

    for (let i = 0; i < playlists.length; i++) {
      const playlistIdx = userPlaylists.indexOf(playlists[i]);
      userPlaylistPlaylistsEntities[playlistIdx].order = i + 1;

      orderData.push([userPlaylistPlaylistsEntities[playlistIdx].id, i + 1]);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const data of orderData) {
        await queryRunner.manager.update(
          UserPlaylistPlaylistEntity,
          { id: data[0] },
          { order: data[1] },
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      this.logger.error(getError(err));
      throw new InternalServerErrorException('unexpected error occurred.');
    } finally {
      await queryRunner.release();
    }

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
