import { randomUUID } from 'node:crypto'
import type { DomainEvent } from './domain-event.js'

export abstract class DomainEventBase implements DomainEvent {
  readonly eventId: string
  readonly occurredAt: Date

  protected constructor(
    readonly aggregateType: string,
    readonly aggregateId: string,
    readonly eventName: string,
    occurredAt: Date = new Date(),
  ) {
    this.eventId = randomUUID()
    this.occurredAt = new Date(occurredAt)
  }
}
