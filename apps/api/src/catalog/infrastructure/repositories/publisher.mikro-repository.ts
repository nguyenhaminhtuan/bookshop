import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { Publisher } from '#catalog/domain/publisher.aggregate.js'
import type { PublisherRepository } from '#catalog/domain/repositories/publisher.repository.js'
import { PublisherId } from '#catalog/domain/value-objects/index.js'

import { PublisherEntity } from '../entities/index.js'

@Injectable()
export class PublisherMikroRepository implements PublisherRepository {
  constructor(private readonly em: EntityManager) {}

  async add(publisher: Publisher): Promise<void> {
    const entity = this.em.create(
      PublisherEntity,
      this.toOrmEntity(publisher, new PublisherEntity()),
    )
    this.em.persist(entity)
  }

  async findById(id: PublisherId): Promise<Publisher | null> {
    const entity = await this.em.findOne(PublisherEntity, id.value)
    return entity ? this.toDomain(entity) : null
  }

  async save(publisher: Publisher): Promise<void> {
    const entity = await this.em.findOneOrFail(PublisherEntity, publisher.id.value)
    this.toOrmEntity(publisher, entity)
    await this.em.flush()
  }

  private toDomain(entity: PublisherEntity): Publisher {
    return Publisher.rehydrate({
      id: PublisherId.from(entity.id),
      name: entity.name,
      bio: entity.bio ?? null,
      image: entity.image ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(publisher: Publisher, entity: PublisherEntity): PublisherEntity {
    wrap(entity).assign(
      {
        id: publisher.id.value,
        name: publisher.name,
        bio: publisher.bio,
        image: publisher.image,
        createdAt: publisher.createdAt,
        updatedAt: publisher.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
