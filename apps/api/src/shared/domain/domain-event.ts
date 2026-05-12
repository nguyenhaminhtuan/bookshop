export interface DomainEvent {
  eventId: string
  aggregateType: string
  aggregateId: string
  eventName: string
  occurredAt: Date
}
