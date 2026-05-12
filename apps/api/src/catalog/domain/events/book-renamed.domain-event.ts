import { DomainEventBase } from '#shared/domain/domain-event-base.js'

import { BookTitle, Slug, type BookId } from '../value-objects/index.js'

export class BookRenamedDomainEvent extends DomainEventBase {
  readonly bookId: string
  readonly newTitle: string
  readonly oldTitle: string
  readonly oldSlug: string
  readonly newSlug: string

  constructor(
    bookId: BookId,
    oldTitle: BookTitle,
    newTitle: BookTitle,
    oldSlug: Slug,
    newSlug: Slug,
  ) {
    super('Book', bookId.value, 'BookRenamed')
    this.bookId = bookId.value
    this.oldTitle = oldTitle.value
    this.newTitle = newTitle.value
    this.oldSlug = oldSlug.value
    this.newSlug = newSlug.value
  }
}
