import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

import { ProcessedEvent } from './processed-event.entity.js'
import type { ProcessedEventRepository } from './processed-event.repository.js'

@Injectable()
export class ProcessedEventMikroRepository implements ProcessedEventRepository {
  constructor(private readonly em: EntityManager) {}

  async isProcessed(eventId: string, handlerName: string): Promise<boolean> {
    const found = await this.em.findOne(ProcessedEvent, { eventId, handlerName })
    return found !== null
  }

  async markProcessed(eventId: string, handlerName: string): Promise<void> {
    const entity = this.em.create(ProcessedEvent, {
      eventId,
      handlerName,
      processedAt: new Date(),
    })
    this.em.persist(entity)
    await this.em.flush()
  }
}
