import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MonthlyEntity } from '../entitys/chart/monthly.entity';
import { WeeklyEntity } from '../entitys/chart/weekly.entity';
import { DailyEntity } from '../entitys/chart/daily.entity';
import { HourlyEntity } from '../entitys/chart/hourly.entity';
import { TotalEntity } from '../entitys/chart/total.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UpdatedEntity } from '../entitys/chart/updated.entity';
import { FindChartsQueryDto } from './dto/query/find-charts.query.dto';

export const entityByType = {
  monthly: MonthlyEntity,
  weekly: WeeklyEntity,
  daily: DailyEntity,
  hourly: HourlyEntity,
  total: TotalEntity,
};

type ChartEntity = MonthlyEntity | WeeklyEntity | DailyEntity | HourlyEntity;

@Injectable()
export class ChartsService {
  constructor(
    @InjectDataSource('chart')
    private readonly dataSourceChart: DataSource,
    @InjectRepository(TotalEntity, 'chart')
    private readonly totalRepository: Repository<TotalEntity>,
    @InjectRepository(UpdatedEntity, 'chart')
    private readonly updatedRepository: Repository<UpdatedEntity>,
  ) {}

  async findOne(id: string): Promise<TotalEntity> {
    return await this.totalRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findCharts(query: FindChartsQueryDto): Promise<Array<TotalEntity>> {
    const type = query.type;
    const limit = query.limit || 10;

    let charts: Array<TotalEntity>;

    if (type == 'total') charts = await this._findChartsByTotal(limit);
    else charts = await this._findCharts(type, limit);

    return charts;
  }

  private async _findCharts(
    type: string,
    limit: number,
  ): Promise<Array<TotalEntity>> {
    const charts = await this.dataSourceChart
      .createQueryBuilder<ChartEntity>(entityByType[type], type)
      .orderBy(`${type}.increase`, 'DESC')
      .limit(limit)
      .getMany();

    const chartIds: Array<string> = charts.map((data) => data.id);
    const unsortedTotalChart = await this.totalRepository.find({
      where: {
        id: In(chartIds),
      },
    });
    const sortedTotalChart: Map<number, TotalEntity> = new Map();

    for (const chart of unsortedTotalChart) {
      const idx = chartIds.indexOf(chart.id);
      if (idx < 0) throw new InternalServerErrorException();
      chart.views = charts[idx].increase;
      chart.last = charts[idx].last;
      sortedTotalChart.set(idx, chart);
    }

    return Array.from(
      new Map([...sortedTotalChart].sort(this.handleChartSort)).values(),
    );
  }

  private handleChartSort(
    a: [number, TotalEntity],
    b: [number, TotalEntity],
  ): number {
    return a[0] - b[0];
  }

  private async _findChartsByTotal(limit: number): Promise<Array<TotalEntity>> {
    return await this.totalRepository.find({
      order: {
        views: {
          direction: 'DESC',
        },
      },
      take: limit,
    });
  }

  async findUpdated(): Promise<number> {
    const updated = await this.updatedRepository.findOne({ where: {} });
    return updated.time;
  }
}
