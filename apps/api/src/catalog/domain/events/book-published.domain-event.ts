import { DomainEventBase } from '#shared/domain/domain-event-base.js'

import type { AuthorId, BookId, BookTitle, CategoryId, TagId } from '../value-objects/index.js'

export class BookPublishedDomainEvent extends DomainEventBase {
  readonly bookId: string
  readonly title: string
  readonly authorIds: string[]
  readonly categoryId: string
  readonly tagIds: string[]

  constructor(
    bookId: BookId,
    title: BookTitle,
    props: {
      categoryId: CategoryId
      authorIds: readonly AuthorId[]
      tagIds?: readonly TagId[]
    },
  ) {
    super('Book', bookId.value, 'BookPublished')

    this.bookId = bookId.value
    this.title = title.value
    this.authorIds = props.authorIds.map((authorId) => authorId.value) ?? []
    this.categoryId = props.categoryId.value
    this.tagIds = props.tagIds?.map((tagId) => tagId.value) ?? []
  }
}
