import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '../core/entitys/main/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  async findCategoriesByType(type: string): Promise<Array<CategoriesEntity>> {
    const categories = await this.categoriesRepository.find({
      where: {
        type: type,
      },
    });

    return categories;
  }
}
