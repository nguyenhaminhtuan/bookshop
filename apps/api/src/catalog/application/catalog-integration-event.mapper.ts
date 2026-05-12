import { Injectable } from '@nestjs/common'

import {
  BookDiscontinuedDomainEvent,
  BookPriceChangedDomainEvent,
  BookPublishedDomainEvent,
  BookRenamedDomainEvent,
} from '#catalog/domain/events/index.js'
import type { DomainEvent } from '#shared/domain/domain-event.js'
import type { IntegrationEvent } from '#shared/integration-event.js'

import {
  BookDiscontinuedIntegrationEvent,
  BookPriceChangedIntegrationEvent,
  BookPublishedIntegrationEvent,
  BookRenamedIntegrationEvent,
} from './integration-events/index.js'

@Injectable()
export class CatalogIntegrationEventMapper {
  map(domainEvent: DomainEvent): IntegrationEvent | null {
    if (domainEvent instanceof BookPublishedDomainEvent) {
      return this.mapBookPublished(domainEvent)
    }
    if (domainEvent instanceof BookRenamedDomainEvent) {
      return this.mapBookRenamed(domainEvent)
    }
    if (domainEvent instanceof BookPriceChangedDomainEvent) {
      return this.mapBookPriceChanged(domainEvent)
    }
    if (domainEvent instanceof BookDiscontinuedDomainEvent) {
      return this.mapBookDiscontinued(domainEvent)
    }

    return null
  }

  private mapBookPublished(event: BookPublishedDomainEvent): BookPublishedIntegrationEvent {
    return new BookPublishedIntegrationEvent(
      event.eventId,
      'book.published.v1',
      event.bookId,
      'book',
      event.occurredAt,
      {
        bookId: event.bookId,
        title: event.title,
        authorIds: event.authorIds,
        categoryId: event.categoryId,
        tagIds: event.tagIds,
      },
    )
  }

  private mapBookRenamed(event: BookRenamedDomainEvent): BookRenamedIntegrationEvent {
    return new BookRenamedIntegrationEvent(
      event.eventId,
      'book.renamed.v1',
      event.bookId,
      'book',
      event.occurredAt,
      {
        bookId: event.bookId,
        oldTitle: event.oldTitle,
        newTitle: event.newTitle,
        oldSlug: event.oldSlug,
        newSlug: event.newSlug,
      },
    )
  }

  private mapBookPriceChanged(event: BookPriceChangedDomainEvent): BookPriceChangedIntegrationEvent {
    return new BookPriceChangedIntegrationEvent(
      event.eventId,
      'book.price-changed.v1',
      event.bookId,
      'book',
      event.occurredAt,
      {
        bookId: event.bookId,
        oldPrice: event.oldPrice,
        newPrice: event.newPrice,
      },
    )
  }

  private mapBookDiscontinued(event: BookDiscontinuedDomainEvent): BookDiscontinuedIntegrationEvent {
    return new BookDiscontinuedIntegrationEvent(
      event.eventId,
      'book.discontinued.v1',
      event.bookId,
      'book',
      event.occurredAt,
      { bookId: event.bookId },
    )
  }
}
