import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface BookDiscontinuedIntegrationEventPayload {
  bookId: string
}

export class BookDiscontinuedIntegrationEvent
  implements IntegrationEvent<BookDiscontinuedIntegrationEventPayload>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: BookDiscontinuedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
