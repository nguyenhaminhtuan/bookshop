import type { MoneyProps } from '#catalog/domain/value-objects/index.js'
import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface BookPriceChangedIntegrationEventPayload {
  bookId: string
  oldPrice: MoneyProps
  newPrice: MoneyProps
}

export class BookPriceChangedIntegrationEvent
  implements IntegrationEvent<BookPriceChangedIntegrationEventPayload>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: BookPriceChangedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
