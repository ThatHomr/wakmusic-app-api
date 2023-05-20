import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { moment } from '../utils/moment.utils';
import { FindOperator, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSongsQueryDto } from './dto/query/find-songs.query.dto';
import * as fs from 'fs';
import { lyricsPath } from '../utils/path.utils';
import { CheckLyricsQueryDto } from './dto/query/check-lyrics.query.dto';
import { FindSongsByPeriodQueryDto } from './dto/query/find-songs-by-period.query.dto';
import { ArtistService } from '../artist/artist.service';
import * as vttParser from 'node-webvtt';
import { SongsEntity } from 'src/entitys/main/songs.entity';

@Injectable()
export class SongsService {
  constructor(
    @Inject(ArtistService)
    private readonly artistService: ArtistService,

    @InjectRepository(SongsEntity)
    private readonly songsRepositroy: Repository<SongsEntity>,
  ) {}

  async findOne(id: string): Promise<SongsEntity> {
    return await this.songsRepositroy.findOne({
      where: { songId: id },
      relations: {
        total: true,
      },
    });
  }

  async findByIds(ids: Array<string>): Promise<Array<SongsEntity>> {
    const unsortedSongs = await this.songsRepositroy.find({
      where: {
        songId: In(ids),
      },
      relations: {
        total: true,
      },
    });

    const sortedSongs: Map<number, SongsEntity> = new Map();

    for (const song of unsortedSongs) {
      const idx = ids.indexOf(song.songId);
      if (idx < 0) throw new InternalServerErrorException();

      sortedSongs.set(idx, song);
    }

    return Array.from(
      new Map([...sortedSongs].sort(this.handleTotalSongsSort)).values(),
    );
  }

  private handleTotalSongsSort(
    a: [number, SongsEntity],
    b: [number, SongsEntity],
  ): number {
    return a[0] - b[0];
  }

  async findNewSongs(
    artist?: string | FindOperator<any>,
    limit = 10,
  ): Promise<Array<SongsEntity>> {
    return await this.songsRepositroy.find({
      where: {
        artists: {
          artistId: artist || null,
        },
      },
      order: {
        date: 'desc',
      },
      take: limit,
      relations: {
        total: true,
      },
    });
  }

  async findNewSongsByMonth(): Promise<Array<SongsEntity>> {
    const time = moment();
    const dateNow = time.format('YYMMDD');
    const dateStart = time.subtract(1, 'months').format('YYMMDD');
    const newSongs = this.songsRepositroy
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total')
      .where('song.date <= :dateNow', { dateNow })
      .andWhere('song.date >= :dateStart', { dateStart })
      .orderBy('song.date', 'DESC');

    return await newSongs.getMany();
  }

  async findNewSongsByGroup(group: string): Promise<Array<SongsEntity>> {
    if (group == 'all') return await this.findNewSongs();

    const artists = await this.artistService.findByGroup(group);

    const artistsSongs = artists.reduce<Array<SongsEntity>>(
      (songs, current) => {
        songs.push(...current.songs);

        return songs;
      },
      [],
    );

    if (artistsSongs.length < 10) return artistsSongs;

    return artistsSongs.slice(0, 10);
  }

  async findSongsByPeriod(
    query: FindSongsByPeriodQueryDto,
  ): Promise<Array<SongsEntity>> {
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

    const songs = await this.songsRepositroy
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.total', 'total')
      .where(`song.date >= :startDate`, { startDate })
      .andWhere('song.date <= :endDate', { endDate })
      .getMany();

    return songs.slice(start, start + 30);
  }

  async findSongsBySearch(
    query: FindSongsQueryDto,
  ): Promise<Array<SongsEntity>> {
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

    const songsQueryBuilder = this.songsRepositroy
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

  async findSongsByLyrics(): Promise<Array<SongsEntity>> {
    const lyrics = fs.readdirSync(lyricsPath);

    const songs = await this.songsRepositroy.find({
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

    return songs.filter((song) => !lyrics.includes(song.songId + '.vtt'));
  }

  async checkLyrics(query: CheckLyricsQueryDto): Promise<boolean> {
    try {
      return fs.existsSync(`${lyricsPath}/${query.id}.vtt`);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findLyrics(id: string): Promise<any> {
    const isLyricsExist = await this.checkLyrics({ id: id });

    if (!isLyricsExist) return null;

    const lyricsFile = fs.readFileSync(`${lyricsPath}/${id}.vtt`, 'utf8');

    return vttParser.parse(lyricsFile, { strict: false }).cues;
  }

  async validateSongs(
    oldSongs: Array<string>,
    editSongs: Array<string>,
  ): Promise<void> {
    if (oldSongs.length !== editSongs.length)
      throw new BadRequestException('songs length not matching');

    for (const song of editSongs) {
      if (!oldSongs.includes(song))
        throw new BadRequestException('invalid song included');
    }

    const songs = await this.songsRepositroy.find({
      where: {
        songId: In(editSongs),
      },
    });
    if (songs.length !== editSongs.length)
      throw new BadRequestException('invalid song included');
  }

  async checkSongs(songIds: Array<string>): Promise<boolean> {
    const songs = await this.songsRepositroy.find({
      where: {
        songId: In(songIds),
      },
    });
    if (songs.length !== songIds.length) return false;

    return true;
  }
}
