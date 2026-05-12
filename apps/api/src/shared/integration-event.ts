export interface IntegrationEvent<TPayload = unknown> {
  id: string
  type: string
  aggregateId: string
  aggregateType: string
  occurredAt: Date
  payload: TPayload
  metadata?: IntegrationEventMetadata
}

export type IntegrationEventMetadata = {
  correlationId?: string
  causationId?: string
}
