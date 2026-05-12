import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface BookPublishedIntegrationEventPayload {
  bookId: string
  title: string
  authorIds: string[]
  categoryId: string
  tagIds: string[]
}

export class BookPublishedIntegrationEvent implements IntegrationEvent<BookPublishedIntegrationEventPayload> {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: BookPublishedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
