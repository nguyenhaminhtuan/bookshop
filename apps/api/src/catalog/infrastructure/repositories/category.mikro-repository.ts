import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { Category } from '#catalog/domain/category.aggregate.js'
import type { CategoryRepository } from '#catalog/domain/repositories/category.repository.js'
import { CategoryId, Slug } from '#catalog/domain/value-objects/index.js'

import { CategoryEntity } from '../entities/index.js'

@Injectable()
export class CategoryMikroRepository implements CategoryRepository {
  constructor(private readonly em: EntityManager) {}

  async add(category: Category): Promise<void> {
    const entity = this.em.create(CategoryEntity, this.toOrmEntity(category, new CategoryEntity()))
    this.em.persist(entity)
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const entity = await this.em.findOne(CategoryEntity, id.value, { populate: ['parent'] })
    return entity ? this.toDomain(entity) : null
  }

  async save(category: Category): Promise<void> {
    const entity = await this.em.findOneOrFail(CategoryEntity, category.id.value)
    this.toOrmEntity(category, entity)
    await this.em.flush()
  }

  private toDomain(entity: CategoryEntity): Category {
    return Category.rehydrate({
      id: CategoryId.from(entity.id),
      name: entity.name,
      slug: Slug.from(entity.slug),
      description: entity.description ?? null,
      image: entity.image ?? null,
      displayOrder: entity.displayOrder,
      parentId: entity.parent ? CategoryId.from(entity.parent.id) : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(category: Category, entity: CategoryEntity): CategoryEntity {
    wrap(entity).assign(
      {
        id: category.id.value,
        name: category.name,
        slug: category.slug.value,
        description: category.description,
        image: category.image,
        displayOrder: category.displayOrder,
        parent: category.parentId
          ? this.em.getReference(CategoryEntity, category.parentId.value)
          : null,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
