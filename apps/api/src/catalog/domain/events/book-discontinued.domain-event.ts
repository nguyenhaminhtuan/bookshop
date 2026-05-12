import { DomainEventBase } from '#shared/domain/domain-event-base.js'

import type { BookId } from '../value-objects/index.js'

export class BookDiscontinuedDomainEvent extends DomainEventBase {
  readonly bookId: string

  constructor(bookId: BookId) {
    super('Book', bookId.value, 'BookDiscontinued')
    this.bookId = bookId.value
  }
}
