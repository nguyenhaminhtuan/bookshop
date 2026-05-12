import { Inject, Injectable, Logger } from '@nestjs/common'

import { Book } from '#catalog/domain/index.js'
import { BOOK_REPOSITORY, type BookRepository } from '#catalog/domain/repositories/index.js'
import { BookId } from '#catalog/domain/value-objects/book-id.value-object.js'
import {
  AuthorId,
  BookImage,
  BookTitle,
  CategoryId,
  Dimension,
  DistributorId,
  ISBN,
  Money,
  PublisherId,
  TagId,
} from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'
import {
  DOMAIN_EVENT_DISPATCHER,
  type DomainEventDispatcher,
} from '#shared/domain-event-dispatcher.js'
import { OUTBOX_REPOSITORY, type OutboxRepository } from '#shared/outbox/index.js'

import { CatalogIntegrationEventMapper } from '../catalog-integration-event.mapper.js'
import type {
  BookTagsDto,
  ChangeBookPriceDto,
  CreateBookDto,
  RenameBookDto,
  UpdateBookInfoDto,
} from '../dtos/index.js'
import { BookNotFoundError } from '../errors/book.application-errors.js'

@Injectable()
export class BookCommandService {
  private readonly logger = new Logger(BookCommandService.name)

  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepo: BookRepository,
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepo: OutboxRepository,
    @Inject(DOMAIN_EVENT_DISPATCHER)
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly integrationEventMapper: CatalogIntegrationEventMapper,
  ) {}

  @Transactional()
  async createBook(dto: CreateBookDto): Promise<{ id: string }> {
    this.logger.debug('Creating book with data %o', dto)
    const book = Book.create({
      ...dto,
      id: BookId.create(),
      isbn: ISBN.create(dto.isbn),
      title: BookTitle.create(dto.title),
      price: Money.create(dto.price),
      images: dto.images.map((image) => BookImage.create(image)),
      dimension: Dimension.create(dto.dimension),
      authorIds: dto.authorIds.map((id) => AuthorId.from(id)),
      categoryId: CategoryId.from(dto.categoryId),
      tagIds: dto.tagIds.map((id) => TagId.from(id)),
      publisherId: PublisherId.from(dto.publisherId),
      distributorId: DistributorId.from(dto.distributorId),
    })
    await this.bookRepo.add(book)
    await this.bookRepo.save(book)
    this.logger.log('Book id: %s created', book.id)
    return { id: book.id.value }
  }

  @Transactional()
  async renameBook(id: string, dto: RenameBookDto): Promise<void> {
    this.logger.debug('Renaming book id: %s with data %o', id, dto)
    const book = await this.loadBook(id)
    book.rename({ title: BookTitle.create(dto.title) })
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book id: %s renamed', id)
  }

  @Transactional()
  async changeBookPrice(id: string, dto: ChangeBookPriceDto): Promise<void> {
    this.logger.debug('Changing price of book id: %s with data %o', id, dto)
    const book = await this.loadBook(id)
    book.changePrice({ price: Money.create(dto.price) })
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book id: %s price changed', id)
  }

  @Transactional()
  async updateBookInfo(id: string, dto: UpdateBookInfoDto): Promise<void> {
    this.logger.debug('Updating book info id: %s with data %o', id, dto)
    const book = await this.loadBook(id)
    book.updateInfo({
      isbn: ISBN.create(dto.isbn),
      description: dto.description,
      dimension: Dimension.create(dto.dimension),
      releaseDate: dto.releaseDate,
      pageCount: dto.pageCount,
      coverMaterial: dto.coverMaterial,
    })
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book id: %s info updated', id)
  }

  @Transactional()
  async addTagsToBook(id: string, dto: BookTagsDto): Promise<void> {
    this.logger.debug('Adding tags %o to book id: %s', dto.tagIds, id)
    const book = await this.loadBook(id)
    book.addTags({ tagIds: dto.tagIds.map((tagId) => TagId.from(tagId)) })
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book id: %s tags added', id)
  }

  @Transactional()
  async removeTagsFromBook(id: string, dto: BookTagsDto): Promise<void> {
    this.logger.debug('Removing tags %o from book id: %s', dto.tagIds, id)
    const book = await this.loadBook(id)
    book.removeTags({ tagIds: dto.tagIds.map((tagId) => TagId.from(tagId)) })
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book id: %s tags removed', id)
  }

  @Transactional()
  async publishBook(id: string): Promise<void> {
    this.logger.debug('Publishing book with id: %s', id)
    const book = await this.loadBook(id)
    book.publish()
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book with id %s published', id)
  }

  @Transactional()
  async discontinue(id: string): Promise<void> {
    this.logger.debug('Discontinuing book with id: %s', id)
    const book = await this.loadBook(id)
    book.discontinue()
    await this.bookRepo.save(book)
    await this.dispatchEvents(book)
    this.logger.log('Book with id %s discontinued', id)
  }

  private async loadBook(id: string): Promise<Book> {
    const book = await this.bookRepo.findById(BookId.from(id))
    if (!book) {
      throw new BookNotFoundError(id)
    }
    return book
  }

  private async dispatchEvents(book: Book): Promise<void> {
    const domainEvents = book.peekDomainEvents()
    if (domainEvents.length === 0) {
      return
    }
    const integrationEvents = domainEvents
      .map((evt) => this.integrationEventMapper.map(evt))
      .filter(Boolean)
    await this.outboxRepo.save(...integrationEvents)
    book.clearDomainEvents()
    await this.domainEventDispatcher.dispatchAll(domainEvents)
  }
}
