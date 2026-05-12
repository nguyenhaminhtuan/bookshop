import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { Distributor } from '#catalog/domain/distributor.aggregate.js'
import type { DistributorRepository } from '#catalog/domain/repositories/distributor.repository.js'
import { DistributorId } from '#catalog/domain/value-objects/index.js'

import { DistributorEntity } from '../entities/index.js'

@Injectable()
export class DistributorMikroRepository implements DistributorRepository {
  constructor(private readonly em: EntityManager) {}

  async add(distributor: Distributor): Promise<void> {
    const entity = this.em.create(
      DistributorEntity,
      this.toOrmEntity(distributor, new DistributorEntity()),
    )
    this.em.persist(entity)
  }

  async findById(id: DistributorId): Promise<Distributor | null> {
    const entity = await this.em.findOne(DistributorEntity, id.value)
    return entity ? this.toDomain(entity) : null
  }

  async save(distributor: Distributor): Promise<void> {
    const entity = await this.em.findOneOrFail(DistributorEntity, distributor.id.value)
    this.toOrmEntity(distributor, entity)
    await this.em.flush()
  }

  private toDomain(entity: DistributorEntity): Distributor {
    return Distributor.rehydrate({
      id: DistributorId.from(entity.id),
      name: entity.name,
      bio: entity.bio ?? null,
      image: entity.image ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(distributor: Distributor, entity: DistributorEntity): DistributorEntity {
    wrap(entity).assign(
      {
        id: distributor.id.value,
        name: distributor.name,
        bio: distributor.bio,
        image: distributor.image,
        createdAt: distributor.createdAt,
        updatedAt: distributor.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
