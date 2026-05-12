import { DomainEventBase } from '#shared/domain/domain-event-base.js'

import { Money, type BookId, type MoneyProps } from '../value-objects/index.js'

export class BookPriceChangedDomainEvent extends DomainEventBase {
  readonly bookId: string
  readonly newPrice: MoneyProps
  readonly oldPrice: MoneyProps

  constructor(bookId: BookId, oldPrice: Money, newPrice: Money) {
    super('Book', bookId.value, 'BookPriceChanged')
    this.bookId = bookId.value
    this.oldPrice = oldPrice.toPrimitives()
    this.newPrice = newPrice.toPrimitives()
  }
}
