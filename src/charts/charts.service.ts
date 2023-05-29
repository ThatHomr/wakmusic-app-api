import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindChartsQueryDto } from './dto/query/find-charts.query.dto';
import { ChartUpdatedEntity } from 'src/core/entitys/main/chartUpdated.entity';
import { SongEntity } from 'src/core/entitys/main/song.entity';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(SongEntity)
    private readonly songRepository: Repository<SongEntity>,
    @InjectRepository(ChartUpdatedEntity)
    private readonly updatedRepository: Repository<ChartUpdatedEntity>,
  ) {}

  async findOne(id: string): Promise<SongEntity> {
    return await this.songRepository.findOne({
      where: {
        songId: id,
      },
    });
  }

  async findCharts(query: FindChartsQueryDto): Promise<Array<SongEntity>> {
    const type = query.type;
    const limit = query.limit || 10;

    return await this.songRepository
      .createQueryBuilder('song')
      .innerJoinAndSelect(`song.${type}`, type)
      .orderBy(type === 'total' ? `${type}.views` : `${type}.increase`, 'DESC')
      .limit(limit)
      .getMany();
  }

  async findUpdated(): Promise<number> {
    const updated = await this.updatedRepository.findOne({ where: {} });
    return updated.time;
  }
}
