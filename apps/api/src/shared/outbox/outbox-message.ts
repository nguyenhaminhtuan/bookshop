export interface OutboxMessage<TPayload extends object = Record<string, unknown>> {
  id: string
  aggregateType: string
  aggregateId: string
  eventType: string
  payload: TPayload
  metadata: Record<string, unknown>
  createdAt: Date
}
