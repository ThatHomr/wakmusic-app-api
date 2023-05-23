import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QnaEntity } from '../core/entitys/main/qna.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(QnaEntity)
    private readonly qnaRepository: Repository<QnaEntity>,
  ) {}

  async findAll(): Promise<Array<QnaEntity>> {
    return await this.qnaRepository.find({
      relations: {
        category: true,
      },
      order: {
        createAt: 'ASC',
      },
    });
  }
}
