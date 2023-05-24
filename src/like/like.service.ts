import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ChartsService } from '../charts/charts.service';
import { LikeDto } from './dto/like.dto';
import { SongsService } from '../songs/songs.service';
import { Cache } from 'cache-manager';
import { LikeEntity } from 'src/core/entitys/main/like.entity';
import { UserLikesEntity } from 'src/core/entitys/main/userLikes.entity';
import { UserLikesSongsEntity } from 'src/core/entitys/main/userLikesSongs.entity';
import { UserService } from 'src/user/user.service';
import { SongsEntity } from 'src/core/entitys/main/songs.entity';

@Injectable()
export class LikeService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly chartsService: ChartsService,
    private readonly songsService: SongsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(UserLikesEntity)
    private readonly userLikesRepository: Repository<UserLikesEntity>,
    @InjectRepository(UserLikesSongsEntity)
    private readonly userLikesSongsRepository: Repository<UserLikesSongsEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findOne(songId: string): Promise<LikeEntity> {
    const song = await this.chartsService.findOne(songId);
    if (!song) throw new NotFoundException('song not found');

    let like: LikeEntity;

    like = await this.likeRepository.findOne({
      where: {
        songId: song.id,
      },
      relations: {
        song: {
          total: true,
        },
      },
    });
    if (!like) like = await this.create(song);

    return like;
  }

  async findByIds(songIds: Array<string>): Promise<Array<LikeDto>> {
    const unsortedLikes = await this.likeRepository.find({
      where: {
        song: {
          songId: In(songIds),
        },
      },
      relations: {
        song: {
          total: true,
        },
      },
    });

    const sortedLikes: Map<number, LikeDto> = new Map();

    for (const like of unsortedLikes) {
      const idx = songIds.indexOf(like.song.songId);
      if (idx < 0) throw new InternalServerErrorException();

      sortedLikes.set(idx, like);
    }

    return Array.from(
      new Map([...sortedLikes].sort((a, b) => a[0] - b[0])).values(),
    );
  }

  async create(song: SongsEntity): Promise<LikeEntity> {
    const like = this.likeRepository.create();
    like.songId = song.id;
    like.likes = 0;

    await this.likeRepository.insert(like);

    const savedLike = await this.likeRepository.findOne({
      relations: {
        song: {
          total: true,
        },
      },
      where: {
        songId: song.id,
      },
    });

    return savedLike;
  }

  async deleteByIds(songIds: Array<string>): Promise<void> {
    const likes = await this.likeRepository.find({
      where: {
        song: {
          songId: In(songIds),
        },
      },
      relations: {
        song: true,
      },
    });

    await this.likeRepository.update(
      {
        id: In(likes.map((like) => like.id)),
      },
      {
        likes: () => 'likes - 1',
      },
    );
  }

  async getLike(songId: string): Promise<LikeEntity> {
    return await this.findOne(songId);
  }

  async addLike(songId: string, userId: string): Promise<LikeEntity> {
    const song = await this.chartsService.findOne(songId);
    if (!song) throw new NotFoundException('존재하지 않는 노래입니다.');

    const userLikes = await this.getUserLikes(userId);
    const songs = userLikes.likes.map((like) => like.like.song.songId);

    if (songs.includes(songId))
      throw new BadRequestException('좋아요를 이미 표시한 노래입니다.');

    const like = await this.findOne(songId);

    const maxOrder =
      userLikes.likes.length !== 0
        ? userLikes.likes.reduce((prev, curr) =>
            prev.order > curr.order ? prev : curr,
          ).order
        : 0;

    const userLikeSongs = this.userLikesSongsRepository.create({
      userLikes: userLikes,
      like: like,
      order: maxOrder + 1,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(UserLikesSongsEntity, userLikeSongs);
      await queryRunner.manager.update(
        LikeEntity,
        { id: like.id },
        { likes: () => 'likes + 1' },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to add like.');
    } finally {
      await queryRunner.release();
    }

    like.likes += 1;

    await this.cacheManager.del(`/api/like/${songId}`);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return like;
  }

  async removeLike(songId: string, userId: string): Promise<LikeEntity> {
    const song = await this.chartsService.findOne(songId);
    if (!song) throw new NotFoundException('존재하지 않는 노래입니다.');

    const userLikes = await this.getUserLikes(userId);
    const songs = userLikes.likes.map((like) => like.like.song.songId);

    if (!songs.includes(songId))
      throw new BadRequestException('좋아요를 표시하지 않은 노래입니다.');

    const songIndex = songs.indexOf(songId);
    const [deleteLikeSongEntity] = userLikes.likes.splice(songIndex, 1);

    const like = await this.findOne(songId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.remove(deleteLikeSongEntity);
      await queryRunner.manager.update(
        LikeEntity,
        { id: like.id },
        { likes: () => 'likes - 1' },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to remove like.');
    } finally {
      await queryRunner.release();
    }

    like.likes -= 1;

    await this.cacheManager.del(`/api/like/${songId}`);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return like;
  }

  async getUserLikes(userId: string): Promise<UserLikesEntity> {
    let userLikes = await this.userLikesRepository.findOne({
      where: {
        user: {
          userId: userId,
        },
      },
      order: {
        likes: {
          order: 'asc',
        },
      },
      relations: {
        user: true,
        likes: {
          like: {
            song: {
              total: true,
            },
          },
        },
      },
    });
    if (!userLikes) userLikes = await this.createUserLikes(userId);

    return userLikes;
  }

  async createUserLikes(userId: string): Promise<UserLikesEntity> {
    const user = await this.userService.findOneById(userId);
    const newUserLikes = this.userLikesRepository.create({
      user: user,
      likes: [],
    });
    await this.userLikesRepository.insert(newUserLikes);
    return await this.userLikesRepository.findOne({
      relations: {
        user: true,
        likes: {
          like: {
            song: {
              total: true,
            },
          },
        },
      },
      where: {
        userId: user.id,
      },
    });
  }

  async editUserLikes(userId: string, songs: Array<string>): Promise<void> {
    const userLikes = await this.getUserLikes(userId);
    await this.validateEditUserLikes(
      userLikes.likes.map((like) => like.like.song.songId),
      songs,
    );

    for (const userLikeSongs of userLikes.likes) {
      const order = songs.indexOf(userLikeSongs.like.song.songId) + 1;
      if (order === 0)
        throw new InternalServerErrorException('error while sorting songs.');

      await this.userLikesSongsRepository.update(
        {
          id: userLikeSongs.id,
        },
        {
          order: order,
        },
      );
      userLikeSongs.order = order;
    }

    await this.cacheManager.del(`(${userId}) /api/user/likes`);
  }

  async validateEditUserLikes(
    oldSongs: Array<string>,
    editSongs: Array<string>,
  ): Promise<void> {
    if (oldSongs.length !== editSongs.length)
      throw new BadRequestException('invalid song list.');

    const songs = await this.songsService.findByIds(editSongs);
    if (songs.length !== editSongs.length)
      throw new BadRequestException('invalid song included');

    for (const song of editSongs) {
      if (!oldSongs.includes(song))
        throw new BadRequestException('invalid song included.');
    }
  }

  async deleteUserLikes(userId: string, songs: Array<string>): Promise<void> {
    const userLikes = await this.getUserLikes(userId);
    const userSongs = userLikes.likes.map((like) => like.like.song.songId);
    this.validateDeleteUserLikes(userSongs, songs);

    await this.deleteByIds(songs);

    const removedEntitys: Array<UserLikesSongsEntity> = [];

    for (const song of songs) {
      const songIdx = userSongs.indexOf(song);
      if (songIdx < 0) throw new InternalServerErrorException();

      const deletedEntitys = userLikes.likes[songIdx];
      removedEntitys.push(deletedEntitys);
    }

    await this.userLikesSongsRepository.delete({
      id: In(removedEntitys.map((entity) => entity.id)),
    });
    await Promise.all(
      songs.map((song) => this.cacheManager.del(`/api/like/${song}`)),
    );
    await this.cacheManager.del(`(${userId}) /api/user/likes`);
  }

  validateDeleteUserLikes(
    currentSongs: Array<string>,
    deleteSongs: Array<string>,
  ): void {
    for (const song of deleteSongs) {
      if (!currentSongs.includes(song))
        throw new BadRequestException('invaild song included');
    }
  }

  // async getManager(userId: string): Promise<LikeManagerEntity> {
  //   let manager = await this.likeManagerRepository.findOne({
  //     where: {
  //       user_id: userId,
  //     },
  //   });
  //   if (!manager) manager = await this.createManager(userId);

  //   return manager;
  // }

  // async createManager(userId: string): Promise<LikeManagerEntity> {
  //   const newManager = this.likeManagerRepository.create();
  //   newManager.user_id = userId;
  //   newManager.songs = [];

  //   return await this.likeManagerRepository.save(newManager);
  // }

  // async editManager(userId: string, body: EditUserLikesBodyDto): Promise<void>;
  // async editManager(manager: LikeManagerEntity): Promise<void>;
  // async editManager(
  //   a: string | LikeManagerEntity,
  //   b?: EditUserLikesBodyDto,
  // ): Promise<void> {
  //   if (
  //     typeof a == 'string' &&
  //     b !== undefined &&
  //     b instanceof EditUserLikesBodyDto
  //   ) {
  //     await this.editManagerByUserId(a, b);
  //   } else if (a instanceof LikeManagerEntity) {
  //     await this.editManagerByManager(a);
  //   }
  // }

  // private async editManagerByUserId(
  //   userId: string,
  //   body: EditUserLikesBodyDto,
  // ): Promise<void> {
  //   const manager = await this.getManager(userId);

  //   await this.songsService.validateSongs(manager.songs, body.songs);

  //   manager.songs = body.songs;
  //   await this.likeManagerRepository.save(manager);
  //   await this.cacheManager.del(`(${userId}) /api/user/likes`);
  // }

  // private async editManagerByManager(
  //   manager: LikeManagerEntity,
  // ): Promise<void> {
  //   await this.likeManagerRepository.update(
  //     { id: manager.id },
  //     { songs: manager.songs },
  //   );
  //   await this.cacheManager.del(`(${manager.user_id}) /api/user/likes`);
  // }
}
