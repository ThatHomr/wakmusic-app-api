import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { FindChartsQueryDto } from './dto/query/find-charts.query.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SongEntity } from 'src/core/entitys/main/song.entity';
import { ChartUpdatedParamDto } from './dto/param/chart-updated.param.dto';

@ApiTags('charts')
@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @ApiOperation({
    summary: '차트 순위',
    description: 'limit개의 음악을 조회수(증가량) 순으로 정렬해 받아옵니다.',
  })
  @ApiOkResponse({
    description: '차트 순위 목록',
    type: () => SongEntity,
    isArray: true,
  })
  @Get('/')
  async findCharts(
    @Query() query: FindChartsQueryDto,
  ): Promise<Array<SongEntity>> {
    return await this.chartsService.findCharts(query);
  }

  @ApiOperation({
    summary: '차트 업데이트 (시간)',
    description:
      '마지막으로 차트가 업데이트된 시각을 timestamp 형식으로 받아옵니다.',
  })
  @ApiOkResponse({
    description: '차트 업데이트 시각',
    type: Number,
  })
  @Get('/updated')
  async findUpdated(): Promise<number> {
    return await this.chartsService.findUpdated();
  }

  @ApiOperation({
    summary: '차트 업데이트 (차트 타입별)',
    description:
      '마지막으로 차트가 업데이트된 시각을 timestamp 형식으로 받아옵니다.',
  })
  @ApiOkResponse({
    description: '차트 업데이트 시각',
    type: Number,
  })
  @Get('/updated/:chartType')
  async findUpdatedByType(
    @Param() param: ChartUpdatedParamDto,
  ): Promise<number> {
    return await this.chartsService.findUpdatedByType(param.chartType);
  }
}
