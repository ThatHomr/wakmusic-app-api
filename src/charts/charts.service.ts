import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindChartsQueryDto } from './dto/query/find-charts.query.dto';
import { ChartUpdatedEntity } from 'src/entitys/main/chartUpdated.entity';
import { SongsEntity } from 'src/entitys/main/songs.entity';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(SongsEntity)
    private readonly songsRepository: Repository<SongsEntity>,
    @InjectRepository(ChartUpdatedEntity)
    private readonly updatedRepository: Repository<ChartUpdatedEntity>,
  ) {}

  async findOne(id: string): Promise<SongsEntity> {
    return await this.songsRepository.findOne({
      where: {
        songId: id,
      },
    });
  }

  async findCharts(query: FindChartsQueryDto): Promise<Array<SongsEntity>> {
    const type = query.type;
    const limit = query.limit || 10;

    const songs = await this.songsRepository
      .createQueryBuilder('songs')
      .innerJoinAndSelect(`songs.${type}`, type)
      .orderBy(`${type}.increase`, 'DESC')
      .limit(limit)
      .getMany();

    return songs;
  }

  async findUpdated(): Promise<number> {
    const updated = await this.updatedRepository.findOne({ where: {} });
    return updated.time;
  }
}
