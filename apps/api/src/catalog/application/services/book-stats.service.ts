import { EntityManager, raw } from '@mikro-orm/postgresql'
import { Injectable, Logger } from '@nestjs/common'

import { BookEntity, BookStatsEntity } from '#catalog/infrastructure/entities/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

@Injectable()
export class BookStatsService {
  private readonly logger = new Logger(BookStatsService.name)

  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async recordRating(bookId: string, rating: number): Promise<void> {
    this.logger.debug('Recording rating %d for book %s', rating, bookId)
    await this.em
      .qb(BookStatsEntity)
      .insert({
        book: this.em.getReference(BookEntity, bookId),
        averageRating: rating.toFixed(2),
        totalReviews: 1,
        totalSales: 0,
        updatedAt: new Date(),
      })
      .onConflict('book')
      .merge({
        averageRating: raw(
          '((book_stats.average_rating * book_stats.total_reviews) + EXCLUDED.average_rating) / (book_stats.total_reviews + 1)',
        ),
        totalReviews: raw('book_stats.total_reviews + 1'),
        updatedAt: raw('now()'),
      })
      .execute()
  }

  @Transactional()
  async recordSale(bookId: string, quantity: number): Promise<void> {
    if (quantity <= 0) return
    this.logger.debug('Recording %d sales for book %s', quantity, bookId)
    await this.em
      .qb(BookStatsEntity)
      .insert({
        book: this.em.getReference(BookEntity, bookId),
        averageRating: '0',
        totalReviews: 0,
        totalSales: quantity,
        updatedAt: new Date(),
      })
      .onConflict('book')
      .merge({
        totalSales: raw('book_stats.total_sales + EXCLUDED.total_sales'),
        updatedAt: raw('now()'),
      })
      .execute()
  }
}
