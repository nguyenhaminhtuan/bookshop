import type { Book } from '../book.aggregate.js'
import type { BookId } from '../value-objects/index.js'

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY')

export interface BookRepository {
  add(book: Book): Promise<void>
  findById(id: BookId): Promise<Book | null>
  save(book: Book): Promise<void>
}
