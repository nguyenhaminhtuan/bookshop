import { Inject, Injectable } from '@nestjs/common'

import {
  BOOK_READ_REPOSITORY,
  BookSortOrder,
  type BookDetailReadModel,
  type BookListFilters,
  type BookReadRepository,
  type BookSummaryReadModel,
  type PaginatedResult,
} from '#catalog/application/read-models/index.js'

import { BookNotFoundError } from '../errors/book.application-errors.js'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const DEFAULT_RELATED_LIMIT = 8
const MAX_RELATED_LIMIT = 24

export interface ListBooksQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  authorId?: string
  tagId?: string
  sort?: BookSortOrder
}

@Injectable()
export class BookQueryService {
  constructor(
    @Inject(BOOK_READ_REPOSITORY)
    private readonly bookReadRepo: BookReadRepository,
  ) {}

  async listBooks(query: ListBooksQuery): Promise<PaginatedResult<BookSummaryReadModel>> {
    const filters: BookListFilters = {
      page: Math.max(1, query.page ?? 1),
      limit: clamp(query.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT),
      search: query.search?.trim() || undefined,
      categoryId: query.categoryId,
      authorId: query.authorId,
      tagId: query.tagId,
      sort: query.sort ?? BookSortOrder.Newest,
    }
    return this.bookReadRepo.list(filters)
  }

  async getBookBySlug(slug: string): Promise<BookDetailReadModel> {
    const book = await this.bookReadRepo.findBySlug(slug)
    if (!book) {
      throw new BookNotFoundError(slug)
    }
    return book
  }

  async getRelatedBooks(slug: string, limit?: number): Promise<BookSummaryReadModel[]> {
    return this.bookReadRepo.findRelated(slug, clamp(limit ?? DEFAULT_RELATED_LIMIT, 1, MAX_RELATED_LIMIT))
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
