import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { CategoriesService } from '../categories/categories.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesEntity } from 'src/entitys/main/categories.entity';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({
    summary: '현재 보여지는 공지 가져오기',
    description: '현재 볼 수 있는 공지들을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '공지 목록',
    type: () => NoticeEntity,
    isArray: true,
  })
  @Get()
  async findCurrentlyShowing(): Promise<Array<NoticeEntity>> {
    return await this.noticeService.findCurrentlyShowing();
  }

  @ApiOperation({
    summary: '모든 공지 가져오기',
    description: '모든 공지를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '모든 공지',
    type: () => NoticeEntity,
    isArray: true,
  })
  @Get('/all')
  async findAll(): Promise<Array<NoticeEntity>> {
    return await this.noticeService.findAll();
  }

  @ApiOperation({
    summary: '최근 공지 가져오기',
    description: '최근 공지를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '최근 공지',
    type: () => NoticeEntity,
  })
  @Get('/latest')
  async findLatest(): Promise<NoticeEntity> {
    return await this.noticeService.findLatest();
  }

  @ApiOperation({
    summary: '공지 카테고리 가져오기',
    description: '모든 공지 카테고리를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '카테고리들',
    type: () => CategoriesEntity,
    isArray: true,
  })
  @Get('/categories')
  async getAllCategories(): Promise<Array<CategoriesEntity>> {
    return await this.categoriesService.findCategoriesByType('notice');
  }
}
