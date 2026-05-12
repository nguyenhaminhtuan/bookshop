import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { Transactional } from '#shared/decorators/transactional.decorator.js'
import { PROCESSED_EVENT_REPOSITORY, type ProcessedEventRepository } from '#shared/inbox/index.js'

import { OrderCompletedIntegrationEvent } from '../integration-events/index.js'
import { BookStatsService } from '../services/book-stats.service.js'

@Injectable()
export class OrderCompletedHandler {
  private readonly logger = new Logger(OrderCompletedHandler.name)

  constructor(
    private readonly bookStatsService: BookStatsService,
    @Inject(PROCESSED_EVENT_REPOSITORY)
    private readonly processedEventRepo: ProcessedEventRepository,
  ) {}

  @OnEvent('order.completed.v1')
  @Transactional()
  async handle(event: OrderCompletedIntegrationEvent): Promise<void> {
    if (await this.processedEventRepo.isProcessed(event.id, OrderCompletedHandler.name)) {
      this.logger.debug('Skipping already-processed event %s', event.id)
      return
    }

    for (const item of event.payload.items) {
      await this.bookStatsService.recordSale(item.bookId, item.quantity)
    }
    await this.processedEventRepo.markProcessed(event.id, OrderCompletedHandler.name)
    this.logger.log(
      'Processed order.completed.v1 event %s for order %s',
      event.id,
      event.payload.orderId,
    )
  }
}
