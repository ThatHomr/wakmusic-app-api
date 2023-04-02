import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainArtistsEntity } from '../entitys/main/artists.entity';
import { Repository } from 'typeorm';
import { FindQueryDto } from './dto/query/find.query.dto';
import { ArtistsEntity } from '../entitys/chart/artists.entity';
import { TotalEntity } from '../entitys/chart/total.entity';
import { FindAllResponseDto } from './dto/response/find-all.response.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly imageService: ImageService,

    @InjectRepository(MainArtistsEntity)
    private readonly mainArtistsRepository: Repository<MainArtistsEntity>,

    @InjectRepository(ArtistsEntity, 'chart')
    private readonly artistsRepository: Repository<ArtistsEntity>,
    @InjectRepository(TotalEntity, 'chart')
    private readonly totalRepository: Repository<TotalEntity>,
  ) {}
  async findAll(): Promise<Array<FindAllResponseDto>> {
    const artists = await this.mainArtistsRepository.find({
      where: {},
    });

    const unsortedAritstsImageVersion =
      await this.imageService.getAllArtistImageVersion();

    const sortedArtists: Map<number, FindAllResponseDto> = new Map();

    for (const image_version of unsortedAritstsImageVersion) {
      const artistIdx = artists.findIndex(
        (artist) => artist.id === image_version.artist,
      );
      if (artistIdx < 0) throw new InternalServerErrorException();

      sortedArtists.set(artistIdx, {
        ...artists[artistIdx],
        color: artists[artistIdx].color
          .split(',')
          .map((data) => data.split('|')),
        image_round_version: image_version.round,
        image_square_version: image_version.square,
      });
    }

    return Array.from(
      new Map([...sortedArtists].sort((a, b) => a[0] - b[0])).values(),
    );
  }

  async findByGroup(group: string): Promise<Array<MainArtistsEntity>> {
    return await this.mainArtistsRepository.find({
      where: {
        group: group,
      },
    });
  }

  async find(query: FindQueryDto): Promise<Array<TotalEntity>> {
    const start = query.start || 0;

    let sort: string;
    let order: boolean;

    if (query.sort == 'new') {
      sort = 'total.date';
      order = true;
    } else if (query.sort == 'old') {
      sort = 'total.date';
      order = false;
    } else if (query.sort == 'popular') {
      sort = 'total.views';
      order = true;
    }

    const songs = await this.artistsRepository.findOne({
      where: {
        artist: query.id,
      },
    });

    const finalSongs = await this.totalRepository
      .createQueryBuilder('total')
      .where('total.id IN (:...ids)', { ids: songs.ids.split(',') })
      .orderBy(sort, order ? 'DESC' : 'ASC')
      .getMany();

    return finalSongs.slice(start, start + 30);
  }
}
