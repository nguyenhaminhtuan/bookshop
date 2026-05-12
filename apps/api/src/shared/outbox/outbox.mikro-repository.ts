import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import type { IntegrationEvent } from '#shared/integration-event.js'

import { OutboxEvent } from './outbox.entity.js'
import type { OutboxRepository } from './outbox.repository.js'

@Injectable()
export class OutboxMikroRepository implements OutboxRepository {
  constructor(private readonly em: EntityManager) {}

  async save(...messages: IntegrationEvent[]): Promise<void> {
    messages.forEach((message) => {
      const event = this.em.create(OutboxEvent, message)
      this.em.persist(event)
    })
    await this.em.flush()
  }
}
