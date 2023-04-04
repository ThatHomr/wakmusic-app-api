import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeEntity } from '../entitys/main/notice.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  async findAll(): Promise<Array<NoticeEntity>> {
    return await this.noticeRepository.find({});
  }

  async findLatest(): Promise<NoticeEntity> {
    return await this.noticeRepository.findOne({
      where: {},
      order: {
        id: 'DESC',
      },
    });
  }

  async findCurrentlyShowing(): Promise<Array<NoticeEntity>> {
    const currentDate = Date.now();
    return await this.noticeRepository.find({
      where: {
        start_at: LessThanOrEqual(currentDate),
        end_at: MoreThanOrEqual(currentDate),
      },
    });
  }
}
