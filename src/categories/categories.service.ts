import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../core/entitys/main/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findCategoriesByType(type: string): Promise<Array<CategoryEntity>> {
    return await this.categoryRepository.find({
      where: {
        type: type,
      },
    });
  }
}
