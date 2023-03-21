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

  async findByIds(song_ids: Array<string>): Promise<Array<LikeDto>> {
    const unsorted_likes = await this.likeRepository.find({
      where: {
        song_id: In(song_ids),
      },
    });
    const sorted_songs = await this.songsService.findByIds(song_ids);

    const sorted_likes: Map<number, LikeDto> = new Map();

    for (const like of unsorted_likes) {
      const idx = song_ids.indexOf(like.song_id);
      if (idx < 0) throw new InternalServerErrorException();

      const song = sorted_songs[idx];

      sorted_likes.set(idx, {
        id: like.id,
        song: song,
        likes: like.likes,
      });
    }

    return Array.from(
      new Map([...sorted_likes].sort((a, b) => a[0] - b[0])).values(),
    );
  }

  async create(songId: string): Promise<LikeEntity> {
    const like = this.likeRepository.create();
    like.song_id = songId;
    return this.likeRepository.save(like);
  }

  async getLike(songId: string): Promise<LikeDto> {
    const like = await this.findOne(songId);
    const song_detail = await this.songsService.findOne(songId);

    return {
      id: like.id,
      song: song_detail,
      likes: like.likes,
    };
  }

  async addLike(songId: string, userId: string): Promise<LikeEntity> {
    const is_song_id_exist = await this.chartsService.findOne(songId);
    if (!is_song_id_exist)
      throw new NotFoundException('존재하지 않는 노래입니다.');

    const manager = await this.getManager(userId);

    if (manager.songs.includes(songId))
      throw new BadRequestException('좋아요를 이미 표시한 노래입니다.');
    manager.songs.push(songId);
    await this.likeManagerRepository.save(manager);

    const like = await this.findOne(songId);
    like.likes += 1;

    const new_like = await this.likeRepository.save(like);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return new_like;
  }

  async removeLike(songId: string, userId: string): Promise<LikeEntity> {
    const is_song_id_exist = await this.chartsService.findOne(songId);
    if (!is_song_id_exist)
      throw new NotFoundException('존재하지 않는 노래입니다.');

    const manager = await this.getManager(userId);

    if (!manager.songs.includes(songId))
      throw new BadRequestException('좋아요를 표시하지 않은 노래입니다.');
    const song_index = manager.songs.indexOf(songId);
    manager.songs.splice(song_index, 1);
    await this.likeManagerRepository.save(manager);

    const like = await this.findOne(songId);
    like.likes -= 1;

    const new_like = await this.likeRepository.save(like);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);

    return new_like;
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
    const new_manager = this.likeManagerRepository.create();
    new_manager.user_id = userId;
    new_manager.songs = [];

    return await this.likeManagerRepository.save(new_manager);
  }

  async editManager(userId: string, body: EditUserLikesBodyDto): Promise<void> {
    const manager = await this.getManager(userId);

    await this.songsService.validateSongs(manager.songs, body.songs);

    manager.songs = body.songs;
    await this.likeManagerRepository.save(manager);
    await this.cacheManager.del(`(${userId}) /api/user/likes`);
  }
}
