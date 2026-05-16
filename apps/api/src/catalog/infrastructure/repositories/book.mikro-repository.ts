import { wrap, EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { Book } from '#catalog/domain/book.aggregate.js'
import type { BookRepository } from '#catalog/domain/repositories/book.repository.js'
import {
  AuthorId,
  BookId,
  BookImage,
  BookTitle,
  CategoryId,
  Dimension,
  DistributorId,
  ISBN,
  Money,
  PublisherId,
  Slug,
  TagId,
} from '#catalog/domain/value-objects/index.js'

import {
  AuthorEntity,
  BookEntity,
  CategoryEntity,
  DistributorEntity,
  PublisherEntity,
  TagEntity,
} from '../entities/index.js'

@Injectable()
export class BookMikroRepository implements BookRepository {
  constructor(private readonly em: EntityManager) {}

  async add(book: Book): Promise<void> {
    const entity = new BookEntity()
    const createdEntity = this.em.create(BookEntity, this.toOrmEntity(book, entity))
    this.em.persist(createdEntity)
  }

  async findById(id: BookId): Promise<Book | null> {
    const book = await this.em.findOne(BookEntity, id.value, {
      populate: ['authors', 'category', 'publisher', 'distributor', 'tags'],
    })
    return book ? this.toDomain(book) : null
  }

  async save(book: Book): Promise<void> {
    const entity = await this.em.findOneOrFail(BookEntity, book.id.value)
    this.toOrmEntity(book, entity)
    await this.em.flush()
  }

  private toDomain(entity: BookEntity): Book {
    return Book.rehydrate({
      id: BookId.from(entity.id),
      slug: Slug.from(entity.slug),
      isbn: ISBN.from(entity.isbn),
      title: BookTitle.from(entity.title),
      description: entity.description,
      price: Money.from(entity.price),
      dimension: Dimension.from(entity.dimension),
      releaseDate: entity.releaseDate,
      pageCount: entity.pageCount ?? null,
      coverMaterial: entity.coverMaterial ?? null,
      images: entity.images.map((image) => BookImage.create({ url: image })),
      status: entity.status,
      publishedAt: entity.publishedAt ?? null,
      discontinuedAt: entity.discontinuedAt ?? null,
      authorIds: entity.authors.map((author) => AuthorId.from(author.id)),
      categoryId: CategoryId.from(entity.category!.id),
      tagIds: entity.tags.map((tag) => TagId.from(tag.id)),
      publisherId: PublisherId.from(entity.publisher.id),
      distributorId: DistributorId.from(entity.distributor.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  private toOrmEntity(book: Book, entity: BookEntity): BookEntity {
    wrap(entity).assign(
      {
        id: book.id.value,
        slug: book.slug.value,
        isbn: book.isbn.value,
        title: book.title.value,
        description: book.description,
        price: book.price.toPrimitives(),
        dimension: book.dimension.toPrimitives(),
        releaseDate: book.releaseDate,
        pageCount: book.pageCount,
        coverMaterial: book.coverMaterial,
        images: book.images.map((image) => image.url),
        status: book.status,
        publishedAt: book.publishedAt,
        discontinuedAt: book.discontinuedAt,
        authors: book.authorIds.map((id) => this.em.getReference(AuthorEntity, id.value)),
        category: this.em.getReference(CategoryEntity, book.categoryId.value),
        tags: book.tagIds.map((id) => this.em.getReference(TagEntity, id.value)),
        publisher: this.em.getReference(PublisherEntity, book.publisherId.value),
        distributor: this.em.getReference(DistributorEntity, book.distributorId.value),
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
      { mergeObjectProperties: true },
    )
    return entity
  }
}
