import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface OrderCompletedIntegrationEventItem {
  bookId: string
  quantity: number
}

export interface OrderCompletedIntegrationEventPayload {
  orderId: string
  items: OrderCompletedIntegrationEventItem[]
}

export class OrderCompletedIntegrationEvent
  implements IntegrationEvent<OrderCompletedIntegrationEventPayload>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: OrderCompletedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
