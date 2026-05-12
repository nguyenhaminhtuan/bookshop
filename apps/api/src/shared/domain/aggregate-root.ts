import type { DomainEvent } from './domain-event.js'

export abstract class AggregateRoot<TId> {
  private readonly domainEvents: DomainEvent[] = []

  protected constructor(public readonly id: TId) {}

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event)
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents]
    this.clearDomainEvents()

    return events
  }

  public peekDomainEvents(): DomainEvent[] {
    return this.domainEvents
  }

  public clearDomainEvents(): void {
    this.domainEvents.length = 0
  }
}
