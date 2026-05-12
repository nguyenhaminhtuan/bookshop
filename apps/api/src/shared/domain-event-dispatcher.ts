import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'

import type { DomainEvent } from './domain/domain-event.js'

export const DOMAIN_EVENT_DISPATCHER = Symbol('DOMAIN_EVENT_DISPATCHER')

export interface DomainEventDispatcher {
  dispatchAll(events: DomainEvent[]): Promise<void>
}

@Injectable()
export class CqrsDomainEventDispatcher implements DomainEventDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  async dispatchAll(events: DomainEvent[]): Promise<void> {
    this.eventBus.publishAll(events)
  }
}
