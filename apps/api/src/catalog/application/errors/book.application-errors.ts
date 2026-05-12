import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class BookNotFoundError extends ApplicationError {
  readonly code = 'BOOK_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(bookId: string) {
    super(`Can not find any book with ${bookId}`)
  }
}
