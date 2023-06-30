import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeEntity } from '../core/entitys/main/notice.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { moment } from '../utils/moment.utils';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  async findAll(): Promise<Array<NoticeEntity>> {
    const currentDate = moment().valueOf();
    return await this.noticeRepository.find({
      where: {
        startAt: LessThanOrEqual(currentDate),
      },
      relations: {
        category: true,
      },
    });
  }

  async findLatest(): Promise<NoticeEntity> {
    return await this.noticeRepository.findOne({
      where: {},
      order: {
        createAt: 'DESC',
      },
      relations: {
        category: true,
      },
    });
  }

  async findCurrentlyShowing(): Promise<Array<NoticeEntity>> {
    const currentDate = moment().valueOf();
    return await this.noticeRepository.find({
      where: {
        startAt: LessThanOrEqual(currentDate),
        endAt: MoreThanOrEqual(currentDate),
      },
      relations: {
        category: true,
      },
    });
  }
}
