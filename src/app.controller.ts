import { CacheTTL, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { NewsEntity } from './core/entitys/main/news.entity';
import { TeamsEntity } from './core/entitys/main/teams.entity';
import { SuccessDto } from './core/dto/success.dto';
import { AppCheckQueryDto } from './core/dto/query/appCheck.query.dto';
import { AppCheckResDto } from './core/dto/response/appCheck.res';

@ApiTags('main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '뉴스 조회',
    description: 'start부터 start+30까지의 뉴스 정보를 받아옵니다. (최신순)',
  })
  @ApiCreatedResponse({
    description: 'start부터 start+30까지의 뉴스 정보를 반환합니다.',
    type: () => NewsEntity,
    isArray: true,
  })
  @Get('/news')
  async findNews(@Query('start') start?: number): Promise<Array<NewsEntity>> {
    return await this.appService.findNews(start);
  }

  @ApiOperation({
    summary: '팀원 목록 조회',
    description: '팀원 목록을 받아옵니다.',
  })
  @ApiCreatedResponse({
    description: '팀원 목록입니다.',
    type: () => TeamsEntity,
    isArray: true,
  })
  @Get('/teams')
  async findAllTeams(): Promise<Array<TeamsEntity>> {
    return await this.appService.findAllTeams();
  }

  @ApiOperation({
    summary: 'Heart Beat',
    description: 'api 상태를 받습니다.',
  })
  @ApiOkResponse({
    description: '상태',
    type: () => SuccessDto,
  })
  @Get('/heartbeat')
  async getHeartBeat(): Promise<SuccessDto> {
    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '앱 체크',
    description: '앱 서비스에 지장이 가는 부분들을 확인합니다.',
  })
  @ApiOkResponse({
    type: () => AppCheckResDto,
  })
  @Get('/app/check')
  @CacheTTL(60)
  async appCheck(@Query() query: AppCheckQueryDto): Promise<AppCheckResDto> {
    return await this.appService.appCheck(query);
  }
}
