import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { Author } from '#catalog/domain/author.aggregate.js'
import type { AuthorRepository } from '#catalog/domain/repositories/author.repository.js'
import {
  AuthorId,
  Slug,
  SocialLink,
  type SocialPlatform,
} from '#catalog/domain/value-objects/index.js'

import { AuthorEntity } from '../entities/index.js'

@Injectable()
export class AuthorMikroRepository implements AuthorRepository {
  constructor(private readonly em: EntityManager) {}

  async add(author: Author): Promise<void> {
    const entity = this.em.create(AuthorEntity, this.toOrmEntity(author, new AuthorEntity()))
    this.em.persist(entity)
  }

  async findById(id: AuthorId): Promise<Author | null> {
    const entity = await this.em.findOne(AuthorEntity, id.value)
    return entity ? this.toDomain(entity) : null
  }

  async save(author: Author): Promise<void> {
    const entity = await this.em.findOneOrFail(AuthorEntity, author.id.value)
    this.toOrmEntity(author, entity)
    await this.em.flush()
  }

  private toDomain(entity: AuthorEntity): Author {
    const socialLinks = Object.entries(entity.socialLinks).map(([platform, url]) =>
      SocialLink.create({ platform: platform as SocialPlatform, url }),
    )
    return Author.rehydrate({
      id: AuthorId.from(entity.id),
      slug: Slug.from(entity.slug),
      name: entity.name,
      bio: entity.bio ?? null,
      image: entity.image ?? null,
      socialLinks,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(author: Author, entity: AuthorEntity): AuthorEntity {
    const socialLinks = author.socialLinks.reduce<Record<string, string>>((acc, link) => {
      acc[link.platform] = link.url
      return acc
    }, {})
    wrap(entity).assign(
      {
        id: author.id.value,
        slug: author.slug.value,
        name: author.name,
        bio: author.bio,
        image: author.image,
        socialLinks,
        createdAt: author.createdAt,
        updatedAt: author.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
