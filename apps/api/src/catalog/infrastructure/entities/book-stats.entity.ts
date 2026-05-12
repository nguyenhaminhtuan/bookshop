import { defineEntity, p } from '@mikro-orm/postgresql'

import { BookEntity } from './book.entity.js'

const BookStatsEntitySchema = defineEntity({
  name: 'BookStatsEntity',
  schema: 'catalog',
  tableName: 'book_stats',
  properties: {
    book: () => p.oneToOne(BookEntity).owner().primary(),
    averageRating: p.decimal().precision(3).scale(2),
    totalReviews: p.integer(),
    totalSales: p.integer(),
    updatedAt: p.datetime(),
  },
})

export class BookStatsEntity extends BookStatsEntitySchema.class {}
BookStatsEntitySchema.setClass(BookStatsEntity)
