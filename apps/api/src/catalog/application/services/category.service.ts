import { Inject, Injectable, Logger } from '@nestjs/common'

import { Category } from '#catalog/domain/category.aggregate.js'
import { CATEGORY_REPOSITORY, type CategoryRepository } from '#catalog/domain/repositories/index.js'
import { CategoryId } from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos/index.js'
import { CategoryNotFoundError } from '../errors/category.application-errors.js'

@Injectable()
export class CategoryCommandService {
  private readonly logger = new Logger(CategoryCommandService.name)

  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: CategoryRepository,
  ) {}

  @Transactional()
  async createCategory(dto: CreateCategoryDto): Promise<{ id: string }> {
    this.logger.debug('Creating category with data %o', dto)
    const now = new Date()
    const category = Category.create({
      id: CategoryId.create(),
      name: dto.name,
      description: dto.description ?? null,
      image: dto.image ?? null,
      displayOrder: dto.displayOrder ?? 0,
      parentId: dto.parentId ? CategoryId.from(dto.parentId) : null,
      createdAt: now,
      updatedAt: now,
    })
    await this.categoryRepo.add(category)
    await this.categoryRepo.save(category)
    this.logger.log('Category id: %s created', category.id)
    return { id: category.id.value }
  }

  @Transactional()
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<void> {
    this.logger.debug('Updating category id: %s with data %o', id, dto)
    const category = await this.categoryRepo.findById(CategoryId.from(id))
    if (!category) {
      throw new CategoryNotFoundError(id)
    }

    category.updateInfo({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      displayOrder: dto.displayOrder,
    })
    await this.categoryRepo.save(category)
    this.logger.log('Category id: %s updated', id)
  }
}
