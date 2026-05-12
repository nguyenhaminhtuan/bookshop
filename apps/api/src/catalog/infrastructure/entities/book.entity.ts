import { defineEntity, p } from '@mikro-orm/core'

import { BookStatus } from '#catalog/domain/enums/book.enums.js'
import type { DimensionProps, MoneyProps } from '#catalog/domain/value-objects/index.js'

import { AuthorEntity } from './author.entity.js'
import { CategoryEntity } from './category.entity.js'
import { DistributorEntity } from './distributor.entity.js'
import { PublisherEntity } from './publisher.entity.js'

const BookSchema = defineEntity({
  name: 'BookEntity',
  schema: 'catalog',
  tableName: 'books',
  properties: {
    id: p.uuid().primary(),
    slug: p.string(),
    isbn: p.string(),
    title: p.string(),
    description: p.string(),
    price: p.json<MoneyProps>(),
    dimension: p.json<DimensionProps>(),
    releaseDate: p.date(),
    pageCount: p.integer().nullable(),
    coverMaterial: p.string().nullable(),
    images: p.array(),
    status: p.enum(() => BookStatus),
    publishedAt: p.datetime().nullable(),
    discontinuedAt: p.datetime().nullable(),
    authors: () =>
      p
        .manyToMany(AuthorEntity)
        .pivotTable('book_authors')
        .joinColumn('book_id')
        .inverseJoinColumn('author_id'),
    tags: () =>
      p
        .manyToMany(AuthorEntity)
        .pivotTable('book_tags')
        .joinColumn('book_id')
        .inverseJoinColumn('tag_id'),
    category: () => p.manyToOne(CategoryEntity).ref(),
    publisher: () => p.manyToOne(PublisherEntity).ref(),
    distributor: () => p.manyToOne(DistributorEntity).ref(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class BookEntity extends BookSchema.class {}
BookSchema.setClass(BookEntity)
