import type { IntegrationEvent, IntegrationEventMetadata } from '#shared/integration-event.js'

export interface ReviewUserRatedIntegrationEventPayload {
  reviewId: string
  bookId: string
  userId: string
  rating: number
}

export class ReviewUserRatedIntegrationEvent
  implements IntegrationEvent<ReviewUserRatedIntegrationEventPayload>
{
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date,
    public readonly payload: ReviewUserRatedIntegrationEventPayload,
    public readonly metadata?: IntegrationEventMetadata | undefined,
  ) {}
}
