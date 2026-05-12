import { Controller } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventPattern, Payload } from '@nestjs/microservices'

import type { IntegrationEvent } from '#shared/integration-event.js'

const ORDER_TOPIC = 'bookshop.order'
const REVIEW_TOPIC = 'bookshop.review'

@Controller()
export class CatalogConsumer {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @EventPattern(ORDER_TOPIC)
  async onOrder(@Payload() message: IntegrationEvent): Promise<void> {
    await this.eventEmitter.emitAsync(message.type, message)
  }

  @EventPattern(REVIEW_TOPIC)
  async onReview(@Payload() message: IntegrationEvent): Promise<void> {
    await this.eventEmitter.emitAsync(message.type, message)
  }
}
