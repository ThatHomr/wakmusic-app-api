import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '../entitys/like/like.entity';
import { In, Repository } from 'typeorm';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { ChartsService } from '../charts/charts.service';
import { LikeDto } from './dto/like.dto';
import { SongsService } from '../songs/songs.service';
import { EditUserLikesBodyDto } from '../user/dto/body/edit-user-likes.body.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class LikeService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly chartsService: ChartsService,
    private readonly songsService: SongsService,

    @InjectRepository(LikeEntity, 'like')
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(LikeManagerEntity, 'like')
    private readonly likeManagerRepository: Repository<LikeManagerEntity>,
  ) {}

  async findOne(songId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist) throw new NotFoundException('song not found');

    let like: LikeEntity;

    like = await this.likeRepository.findOne({
      where: {
        song_id: songId,
      },
    });
    if (!like) like = await this.create(songId);

    return like;
  }

  async findByIds(songIds: Array<string>): Promise<Array<LikeDto>> {
    const unsortedLikes = await this.likeRepository.find({
      where: {
        song_id: In(songIds),
      },
    });
    const sortedSongs = await this.songsService.findByIds(songIds);

    const sortedLikes: Map<number, LikeDto> = new Map();

    for (const like of unsortedLikes) {
      const idx = songIds.indexOf(like.song_id);
      if (idx < 0) throw new InternalServerErrorException();

      const song = sortedSongs[idx];

      sortedLikes.set(idx, {
        id: like.id,
        song: song,
        likes: like.likes,
      });
    }

    return Array.from(
      new Map([...sortedLikes].sort((a, b) => a[0] - b[0])).values(),
    );
  }

  async create(songId: string): Promise<LikeEntity> {
    const like = this.likeRepository.create();
    like.song_id = songId;
    return this.likeRepository.save(like);
  }

  async deleteByIds(songIds: Array<string>): Promise<void> {
    await this.likeRepository.update(
      {
        song_id: In(songIds),
      },
      {
        likes: () => 'likes - 1',
      },
    );
  }

  async getLike(songId: string): Promise<LikeDto> {
    const like = await this.findOne(songId);
    const songDetail = await this.songsService.findOne(songId);

    return {
      id: like.id,
      song: songDetail,
      likes: like.likes,
    };
  }

  async addLike(songId: string, userId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist)
      throw new NotFoundException('존재하지 않는 노래입니다.');

    const manager = await this.getManager(userId);

    if (manager.songs.includes(songId))
      throw new BadRequestException('좋아요를 이미 표시한 노래입니다.');
    manager.songs.push(songId);
    await this.likeManagerRepository.save(manager);

    const like = await this.findOne(songId);
    like.likes += 1;

    const newLike = await this.likeRepository.save(like);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return newLike;
  }

  async removeLike(songId: string, userId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist)
      throw new NotFoundException('존재하지 않는 노래입니다.');

    const manager = await this.getManager(userId);

    if (!manager.songs.includes(songId))
      throw new BadRequestException('좋아요를 표시하지 않은 노래입니다.');
    const songIndex = manager.songs.indexOf(songId);
    manager.songs.splice(songIndex, 1);
    await this.likeManagerRepository.save(manager);

    const like = await this.findOne(songId);
    like.likes -= 1;

    const newLike = await this.likeRepository.save(like);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return newLike;
  }

  async getManager(userId: string): Promise<LikeManagerEntity> {
    let manager = await this.likeManagerRepository.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!manager) manager = await this.createManager(userId);

    return manager;
  }

  async createManager(userId: string): Promise<LikeManagerEntity> {
    const newManager = this.likeManagerRepository.create();
    newManager.user_id = userId;
    newManager.songs = [];

    return await this.likeManagerRepository.save(newManager);
  }

  async editManager(userId: string, body: EditUserLikesBodyDto): Promise<void>;
  async editManager(manager: LikeManagerEntity): Promise<void>;
  async editManager(
    a: string | LikeManagerEntity,
    b?: EditUserLikesBodyDto,
  ): Promise<void> {
    if (
      typeof a == 'string' &&
      b !== undefined &&
      b instanceof EditUserLikesBodyDto
    ) {
      await this.editManagerByUserId(a, b);
    } else if (a instanceof LikeManagerEntity) {
      await this.editManagerByManager(a);
    }
  }

  private async editManagerByUserId(
    userId: string,
    body: EditUserLikesBodyDto,
  ): Promise<void> {
    const manager = await this.getManager(userId);

    await this.songsService.validateSongs(manager.songs, body.songs);

    manager.songs = body.songs;
    await this.likeManagerRepository.save(manager);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);
  }

  private async editManagerByManager(
    manager: LikeManagerEntity,
  ): Promise<void> {
    await this.likeManagerRepository.update(
      { id: manager.id },
      { songs: manager.songs },
    );
    await this.cacheManager.del(`(${manager.user_id}) /api/user/likes`);
  }
}
