import type { BookStatus } from '#catalog/domain/enums/book.enums.js'
import type { DimensionProps, MoneyProps } from '#catalog/domain/value-objects/index.js'

export interface AuthorRef {
  id: string
  slug: string
  name: string
  image: string | null
}

export interface CategoryRef {
  id: string
  slug: string
  name: string
}

export interface TagRef {
  id: string
  slug: string
  name: string
}

export interface PartyRef {
  id: string
  name: string
  image: string | null
}

export interface BookStatsReadModel {
  averageRating: number
  totalReviews: number
  totalSales: number
}

export interface BookSummaryReadModel {
  id: string
  slug: string
  title: string
  price: MoneyProps
  coverImage: string | null
  status: BookStatus
  releaseDate: string
  publishedAt: Date | null
  authors: AuthorRef[]
  category: CategoryRef
  stats: BookStatsReadModel
}

export interface BookDetailReadModel extends BookSummaryReadModel {
  isbn: string
  description: string
  dimension: DimensionProps
  pageCount: number | null
  coverMaterial: string | null
  images: string[]
  tags: TagRef[]
  publisher: PartyRef
  distributor: PartyRef
  discontinuedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
