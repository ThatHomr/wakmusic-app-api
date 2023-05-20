import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindQueryDto } from './dto/query/find.query.dto';
import { ArtistsEntity } from 'src/entitys/main/artists.entity';
import { SongsEntity } from 'src/entitys/main/songs.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistsEntity)
    private readonly artistsRepository: Repository<ArtistsEntity>,

    @InjectRepository(SongsEntity)
    private readonly songsRepository: Repository<SongsEntity>,
  ) {}

  async findAll(): Promise<Array<ArtistsEntity>> {
    return await this.artistsRepository.find({
      order: {
        order: 'ASC',
      },
      relations: ['group', 'image'],
    });
  }

  async findByGroup(group: string): Promise<Array<ArtistsEntity>> {
    return await this.artistsRepository.find({
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

  async find(query: FindQueryDto): Promise<Array<SongsEntity>> {
    const start = query.start || 0;

    let sort: string;
    let desc: boolean;

    if (query.sort == 'new') {
      sort = 'songs.date';
      desc = true;
    } else if (query.sort == 'old') {
      sort = 'songs.date';
      desc = false;
    } else if (query.sort == 'popular') {
      sort = 'total.views';
      desc = true;
    }

    const songs = await this.songsRepository
      .createQueryBuilder('songs')
      .leftJoin('songs.artists', 'artists')
      .leftJoinAndSelect('songs.total', 'total')
      .where('artists.artistId = :artistId', { artistId: query.id })
      .orderBy(sort, desc ? 'DESC' : 'ASC')
      .getMany();

    return songs.slice(start, start + 30);
  }
}
