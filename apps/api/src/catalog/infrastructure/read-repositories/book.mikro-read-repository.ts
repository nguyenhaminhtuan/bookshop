import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import type {
  AuthorRef,
  BookDetailReadModel,
  BookListFilters,
  BookReadRepository,
  BookSummaryReadModel,
  CategoryRef,
  PaginatedResult,
  PartyRef,
  TagRef,
} from '#catalog/application/read-models/index.js'
import { BookSortOrder } from '#catalog/application/read-models/index.js'
import { BookStatus } from '#catalog/domain/enums/book.enums.js'
import type { DimensionProps, MoneyProps } from '#catalog/domain/value-objects/index.js'

interface BookSummaryRow {
  id: string
  slug: string
  title: string
  price: MoneyProps
  cover_image: string | null
  status: BookStatus
  release_date: Date | string
  published_at: Date | null
  average_rating: string | number
  total_reviews: string | number
  total_sales: string | number
  category: CategoryRef
  authors: AuthorRef[] | null
}

interface BookDetailRow extends BookSummaryRow {
  isbn: string
  description: string
  dimension: DimensionProps
  page_count: number | null
  cover_material: string | null
  images: string[]
  discontinued_at: Date | null
  created_at: Date
  updated_at: Date
  tags: TagRef[] | null
  publisher: PartyRef
  distributor: PartyRef
}

const SUMMARY_PROJECTION = `
  b.id,
  b.slug,
  b.title,
  b.price,
  b.images[1] AS cover_image,
  b.status,
  b.release_date,
  b.published_at,
  COALESCE(s.average_rating, 0)::float AS average_rating,
  COALESCE(s.total_reviews, 0) AS total_reviews,
  COALESCE(s.total_sales, 0) AS total_sales,
  json_build_object('id', c.id, 'slug', c.slug, 'name', c.name) AS category,
  COALESCE(authors_agg.authors, '[]'::json) AS authors
`

const SUMMARY_FROM = `
  catalog.books b
  JOIN catalog.categories c ON c.id = b.category_id
  LEFT JOIN catalog.book_stats s ON s.book_id = b.id
  LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
      'id', a.id, 'slug', a.slug, 'name', a.name, 'image', a.image
    ) ORDER BY a.name) AS authors
    FROM catalog.book_authors ba JOIN catalog.authors a ON a.id = ba.author_id
    WHERE ba.book_id = b.id
  ) authors_agg ON true
`

@Injectable()
export class BookMikroReadRepository implements BookReadRepository {
  constructor(private readonly em: EntityManager) {}

  async findBySlug(slug: string): Promise<BookDetailReadModel | null> {
    const sql = `
      SELECT
        ${SUMMARY_PROJECTION},
        b.isbn,
        b.description,
        b.dimension,
        b.page_count,
        b.cover_material,
        b.images,
        b.discontinued_at,
        b.created_at,
        b.updated_at,
        json_build_object('id', p.id, 'name', p.name, 'image', p.image) AS publisher,
        json_build_object('id', d.id, 'name', d.name, 'image', d.image) AS distributor,
        COALESCE(tags_agg.tags, '[]'::json) AS tags
      FROM ${SUMMARY_FROM}
        JOIN catalog.publishers p ON p.id = b.publisher_id
        JOIN catalog.distributors d ON d.id = b.distributor_id
        LEFT JOIN LATERAL (
          SELECT json_agg(json_build_object(
            'id', t.id, 'slug', t.slug, 'name', t.name
          ) ORDER BY t.name) AS tags
          FROM catalog.book_tags bt JOIN catalog.tags t ON t.id = bt.tag_id
          WHERE bt.book_id = b.id
        ) tags_agg ON true
      WHERE b.slug = ?
      LIMIT 1
    `
    const rows = await this.execute<BookDetailRow>(sql, [slug])
    const row = rows[0]
    return row ? toDetail(row) : null
  }

  async list(filters: BookListFilters): Promise<PaginatedResult<BookSummaryReadModel>> {
    const where: string[] = ["b.status = 'PUBLISHED'"]
    const params: unknown[] = []

    if (filters.search) {
      params.push(`%${filters.search}%`)
      where.push(`b.title ILIKE ?`)
    }
    if (filters.categoryId) {
      params.push(filters.categoryId)
      where.push(`b.category_id = ?`)
    }
    if (filters.authorId) {
      params.push(filters.authorId)
      where.push(`EXISTS (SELECT 1 FROM catalog.book_authors ba WHERE ba.book_id = b.id AND ba.author_id = ?)`)
    }
    if (filters.tagId) {
      params.push(filters.tagId)
      where.push(`EXISTS (SELECT 1 FROM catalog.book_tags bt WHERE bt.book_id = b.id AND bt.tag_id = ?)`)
    }

    const whereClause = where.join(' AND ')
    const orderBy = buildOrderBy(filters.sort)
    const offset = (filters.page - 1) * filters.limit

    const listSql = `
      SELECT ${SUMMARY_PROJECTION}
      FROM ${SUMMARY_FROM}
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `
    const countSql = `SELECT COUNT(*)::int AS total FROM catalog.books b WHERE ${whereClause}`

    const [rows, countRows] = await Promise.all([
      this.execute<BookSummaryRow>(listSql, [...params, filters.limit, offset]),
      this.execute<{ total: number }>(countSql, params),
    ])

    return {
      items: rows.map(toSummary),
      total: countRows[0]?.total ?? 0,
      page: filters.page,
      limit: filters.limit,
    }
  }

  async findRelated(slug: string, limit: number): Promise<BookSummaryReadModel[]> {
    const sql = `
      WITH source AS (
        SELECT id, category_id FROM catalog.books WHERE slug = ? LIMIT 1
      ),
      source_authors AS (
        SELECT author_id FROM catalog.book_authors WHERE book_id = (SELECT id FROM source)
      ),
      source_tags AS (
        SELECT tag_id FROM catalog.book_tags WHERE book_id = (SELECT id FROM source)
      ),
      scored AS (
        SELECT
          b.id,
          (CASE WHEN b.category_id = (SELECT category_id FROM source) THEN 3 ELSE 0 END)
          + (SELECT COUNT(*) FROM catalog.book_authors ba
             WHERE ba.book_id = b.id AND ba.author_id IN (SELECT author_id FROM source_authors)) * 2
          + (SELECT COUNT(*) FROM catalog.book_tags bt
             WHERE bt.book_id = b.id AND bt.tag_id IN (SELECT tag_id FROM source_tags)) AS score
        FROM catalog.books b
        WHERE b.id <> (SELECT id FROM source) AND b.status = 'PUBLISHED'
      )
      SELECT ${SUMMARY_PROJECTION}
      FROM ${SUMMARY_FROM}
        JOIN scored sc ON sc.id = b.id
      WHERE sc.score > 0
      ORDER BY sc.score DESC, b.published_at DESC NULLS LAST
      LIMIT ?
    `
    const rows = await this.execute<BookSummaryRow>(sql, [slug, limit])
    return rows.map(toSummary)
  }

  private async execute<T>(sql: string, params: unknown[]): Promise<T[]> {
    const connection = this.em.getConnection()
    return (await connection.execute(sql, params, 'all')) as T[]
  }
}

function buildOrderBy(sort: BookSortOrder): string {
  switch (sort) {
    case BookSortOrder.PriceAsc:
      return `(b.price->>'amount')::numeric ASC, b.published_at DESC NULLS LAST`
    case BookSortOrder.PriceDesc:
      return `(b.price->>'amount')::numeric DESC, b.published_at DESC NULLS LAST`
    case BookSortOrder.BestSelling:
      return `COALESCE(s.total_sales, 0) DESC, b.published_at DESC NULLS LAST`
    case BookSortOrder.TopRated:
      return `COALESCE(s.average_rating, 0) DESC, COALESCE(s.total_reviews, 0) DESC, b.published_at DESC NULLS LAST`
    case BookSortOrder.Newest:
    default:
      return `b.published_at DESC NULLS LAST, b.created_at DESC`
  }
}

function toSummary(row: BookSummaryRow): BookSummaryReadModel {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price,
    coverImage: row.cover_image,
    status: row.status,
    releaseDate: toIsoDate(row.release_date),
    publishedAt: row.published_at ? new Date(row.published_at) : null,
    authors: row.authors ?? [],
    category: row.category,
    stats: {
      averageRating: Number(row.average_rating),
      totalReviews: Number(row.total_reviews),
      totalSales: Number(row.total_sales),
    },
  }
}

function toDetail(row: BookDetailRow): BookDetailReadModel {
  return {
    ...toSummary(row),
    isbn: row.isbn,
    description: row.description,
    dimension: row.dimension,
    pageCount: row.page_count,
    coverMaterial: row.cover_material,
    images: row.images ?? [],
    tags: row.tags ?? [],
    publisher: row.publisher,
    distributor: row.distributor,
    discontinuedAt: row.discontinued_at ? new Date(row.discontinued_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function toIsoDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return value
}
