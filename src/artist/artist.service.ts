import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindQueryDto } from './dto/query/find.query.dto';
import { ArtistEntity } from 'src/core/entitys/main/artistEntity';
import { SongEntity } from 'src/core/entitys/main/song.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,

    @InjectRepository(SongEntity)
    private readonly songRepository: Repository<SongEntity>,
  ) {}

  async findAll(): Promise<Array<ArtistEntity>> {
    return await this.artistRepository.find({
      order: {
        order: 'ASC',
      },
      relations: {
        group: true,
        image: true,
      },
    });
  }

  async findByGroup(group: string): Promise<Array<ArtistEntity>> {
    return await this.artistRepository.find({
      where: {
        group: {
          en: group,
        },
      },
      order: {
        order: 'ASC',
        songs: {
          date: 'desc',
        },
      },
      relations: {
        group: true,
        image: true,
        songs: {
          total: true,
        },
      },
    });
  }

  async find(query: FindQueryDto): Promise<Array<SongEntity>> {
    const start = query.start || 0;

    let sort: string;
    let desc: boolean;

    if (query.sort == 'new') {
      sort = 'song.date';
      desc = true;
    } else if (query.sort == 'old') {
      sort = 'song.date';
      desc = false;
    } else if (query.sort == 'popular') {
      sort = 'total.views';
      desc = true;
    }

    const songs = await this.songRepository
      .createQueryBuilder('song')
      .leftJoin('song.artists', 'artists')
      .leftJoinAndSelect('song.total', 'total')
      .where('artists.artistId = :artistId', { artistId: query.id })
      .orderBy(sort, desc ? 'DESC' : 'ASC')
      .getMany();

    return songs.slice(start, start + 30);
  }
}
