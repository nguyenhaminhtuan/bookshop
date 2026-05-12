import { DomainError } from '#shared/domain/domain-error.js'

import type { BookStatus } from '../enums/book.enums.js'

export class CannotPublishBookError extends DomainError {
  readonly code = 'BOOK_CANNOT_BE_PUBLISHED'

  constructor(reason: string) {
    super(`Cannot publish book: ${reason}`)
  }
}

export class CannotDiscontinueBookError extends DomainError {
  readonly code = 'BOOK_CANNOT_BE_DISCONTINUED'

  constructor(status: BookStatus) {
    super(`Cannot discontinue book with status: ${status}`)
  }
}
