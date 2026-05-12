import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import type { TagRepository } from '#catalog/domain/repositories/tag.repository.js'
import { Tag } from '#catalog/domain/tag.aggregate.js'
import { Slug, TagId } from '#catalog/domain/value-objects/index.js'

import { TagEntity } from '../entities/index.js'

@Injectable()
export class TagMikroRepository implements TagRepository {
  constructor(private readonly em: EntityManager) {}

  async add(tag: Tag): Promise<void> {
    const entity = this.em.create(TagEntity, this.toOrmEntity(tag, new TagEntity()))
    this.em.persist(entity)
  }

  async findById(id: TagId): Promise<Tag | null> {
    const entity = await this.em.findOne(TagEntity, id.value)
    return entity ? this.toDomain(entity) : null
  }

  async save(tag: Tag): Promise<void> {
    const entity = await this.em.findOneOrFail(TagEntity, tag.id.value)
    this.toOrmEntity(tag, entity)
    await this.em.flush()
  }

  private toDomain(entity: TagEntity): Tag {
    return Tag.rehydrate({
      id: TagId.from(entity.id),
      name: entity.name,
      slug: Slug.from(entity.slug),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(tag: Tag, entity: TagEntity): TagEntity {
    wrap(entity).assign(
      {
        id: tag.id.value,
        name: tag.name,
        slug: tag.slug.value,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
