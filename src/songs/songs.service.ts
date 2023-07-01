import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { moment } from '../utils/moment.utils';
import { FindOperator, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSongsQueryDto } from './dto/query/find-songs.query.dto';
import { CheckLyricsQueryDto } from './dto/query/check-lyrics.query.dto';
import { FindSongsByPeriodQueryDto } from './dto/query/find-songs-by-period.query.dto';
import * as vttParser from 'node-webvtt';
import { SongEntity } from 'src/core/entitys/main/song.entity';
import { LyricsEntity } from 'src/core/entitys/main/lyrics.entity';
import { FileService } from 'src/file/file.service';

@Injectable()
export class SongsService {
  private logger = new Logger(SongsService.name);

  constructor(
    @Inject(FileService)
    private readonly fileSerivce: FileService,

    @InjectRepository(SongEntity)
    private readonly songRepository: Repository<SongEntity>,
    @InjectRepository(LyricsEntity)
    private readonly lyricsRepository: Repository<LyricsEntity>,
  ) {}

  async findByIds(ids: Array<string>): Promise<Array<SongEntity>> {
    const unsortedSongs = await this.songRepository.find({
      where: {
        songId: In(ids),
      },
      relations: {
        total: true,
      },
    });

    const sortedSongs: Map<number, SongEntity> = new Map();

    for (const song of unsortedSongs) {
      const idx = ids.indexOf(song.songId);
      if (idx < 0) {
        this.logger.error('error while sorting songs.');
        throw new InternalServerErrorException('unexpected error occurred.');
      }

      sortedSongs.set(idx, song);
    }

    return Array.from(
      new Map([...sortedSongs].sort(this.handleTotalSongsSort)).values(),
    );
  }

  private handleTotalSongsSort(
    a: [number, SongEntity],
    b: [number, SongEntity],
  ): number {
    return a[0] - b[0];
  }

  async findNewSongs(
    artist?: string | FindOperator<any>,
    limit = 10,
  ): Promise<Array<SongEntity>> {
    return await this.songRepository.find({
      where: {
        artists: {
          artistId: artist || null,
        },
      },
      order: {
        date: 'desc',
        id: 'desc',
      },
      take: limit,
      relations: {
        total: true,
      },
    });
  }

  async findNewSongsByMonth(): Promise<Array<SongEntity>> {
    const time = moment();
    const dateNow = time.format('YYMMDD');
    const dateStart = time.subtract(1, 'months').format('YYMMDD');
    const newSongs = this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total')
      .where('song.date <= :dateNow', { dateNow })
      .andWhere('song.date >= :dateStart', { dateStart })
      .orderBy('song.date', 'DESC')
      .addOrderBy('song.id', 'DESC');

    return await newSongs.getMany();
  }

  async findNewSongsByGroup(group: string): Promise<Array<SongEntity>> {
    if (group == 'all') return await this.findNewSongs();

    const songs = await this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total')
      .leftJoin('song.artists', 'artists')
      .leftJoin('artists.group', 'group')
      .where('group.en = :groupId', { groupId: group })
      .orderBy('song.date', 'DESC')
      .addOrderBy('song.id', 'DESC')
      .take(10)
      .getMany();

    return songs;
  }

  async findSongsByPeriod(
    query: FindSongsByPeriodQueryDto,
  ): Promise<Array<SongEntity>> {
    let startDate: string;
    let endDate: string;

    const start = query.start || 0;
    const period = query.period.toString().slice(2);

    if (query.type == 'month') {
      startDate = `${period}00`;
      endDate = `${period}32`;
    } else if (query.type == 'year') {
      startDate = `${period}0100`;
      endDate = `${period}1232`;
    }

    const songs = await this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total')
      .where(`song.date >= :startDate`, { startDate })
      .andWhere('song.date <= :endDate', { endDate })
      .getMany();

    return songs.slice(start, start + 30);
  }

  async findSongsBySearch(
    query: FindSongsQueryDto,
  ): Promise<Array<SongEntity>> {
    const keyword = decodeURI(query.keyword);

    let sort: string;
    let order: boolean;
    if (query.sort == 'new') {
      sort = 'song.date';
      order = true;
    } else if (query.sort == 'old') {
      sort = 'song.date';
      order = false;
    } else if (query.sort == 'popular') {
      sort = 'total.views';
      order = true;
    }

    const songsQueryBuilder = this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total');

    if (query.type == 'ids') {
      songsQueryBuilder.where('song.songId IN (:...ids)', {
        ids: keyword.split(','),
      });
    } else {
      songsQueryBuilder.where(`song.${query.type} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      });
    }
    songsQueryBuilder.orderBy(sort, order ? 'DESC' : 'ASC');

    return await songsQueryBuilder.getMany();
  }

  async findSongsByLyrics(): Promise<Array<SongEntity>> {
    const songs = await this.songRepository.find({
      select: {
        id: true,
        songId: true,
        title: true,
        artist: true,
        date: true,
      },
      order: {
        date: {
          direction: 'ASC',
        },
      },
    });
    const allLyrics = await this.lyricsRepository.find({});
    const lyricsMap = new Map<string, string>();
    for (const lyrics of allLyrics) {
      lyricsMap.set(lyrics.key, lyrics.key);
    }

    return songs.filter((song) => lyricsMap.get(song.songId) === undefined);
  }

  async checkLyrics(query: CheckLyricsQueryDto): Promise<boolean> {
    return await this.lyricsRepository.exist({
      where: {
        key: query.id,
      },
    });
  }

  async findLyrics(id: string): Promise<Array<vttParser.Cue>> {
    const isLyricsExist = await this.checkLyrics({ id: id });

    if (!isLyricsExist) throw new NotFoundException('lyrics not exist.');

    const lyricsVtt = await this.fileSerivce.lyricsFindOne(id);
    if (lyricsVtt === null)
      throw new NotFoundException('failed to get lyrics.');

    return lyricsVtt.cues;
  }

  async checkSongs(songIds: Array<string>): Promise<boolean> {
    const songs = await this.songRepository.find({
      where: {
        songId: In(songIds),
      },
    });
    return songs.length === songIds.length;
  }
}
