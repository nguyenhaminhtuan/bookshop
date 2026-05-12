import type { BookDetailReadModel, BookSummaryReadModel } from './book.read-model.js'

export const BOOK_READ_REPOSITORY = Symbol('BOOK_READ_REPOSITORY')

export const BookSortOrder = {
  Newest: 'newest',
  PriceAsc: 'price_asc',
  PriceDesc: 'price_desc',
  BestSelling: 'best_selling',
  TopRated: 'top_rated',
} as const

export type BookSortOrder = (typeof BookSortOrder)[keyof typeof BookSortOrder]

export interface BookListFilters {
  page: number
  limit: number
  search?: string
  categoryId?: string
  authorId?: string
  tagId?: string
  sort: BookSortOrder
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface BookReadRepository {
  findBySlug(slug: string): Promise<BookDetailReadModel | null>
  list(filters: BookListFilters): Promise<PaginatedResult<BookSummaryReadModel>>
  findRelated(slug: string, limit: number): Promise<BookSummaryReadModel[]>
}
