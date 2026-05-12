import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface BookRenamedIntegrationEventPayload {
  bookId: string
  oldTitle: string
  newTitle: string
  oldSlug: string
  newSlug: string
}

export class BookRenamedIntegrationEvent
  implements IntegrationEvent<BookRenamedIntegrationEventPayload>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: BookRenamedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
