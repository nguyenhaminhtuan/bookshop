import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { Transactional } from '#shared/decorators/transactional.decorator.js'
import { PROCESSED_EVENT_REPOSITORY, type ProcessedEventRepository } from '#shared/inbox/index.js'

import { ReviewUserRatedIntegrationEvent } from '../integration-events/index.js'
import { BookStatsService } from '../services/book-stats.service.js'

@Injectable()
export class ReviewUserRatedHandler {
  private readonly logger = new Logger(ReviewUserRatedHandler.name)

  constructor(
    private readonly bookStatsService: BookStatsService,
    @Inject(PROCESSED_EVENT_REPOSITORY)
    private readonly processedEventRepo: ProcessedEventRepository,
  ) {}

  @OnEvent('review.user_rated.v1')
  @Transactional()
  async handle(event: ReviewUserRatedIntegrationEvent): Promise<void> {
    if (await this.processedEventRepo.isProcessed(event.id, ReviewUserRatedHandler.name)) {
      this.logger.debug('Skipping already-processed event %s', event.id)
      return
    }

    await this.bookStatsService.recordRating(event.payload.bookId, event.payload.rating)
    await this.processedEventRepo.markProcessed(event.id, ReviewUserRatedHandler.name)
    this.logger.log(
      'Processed review.user_rated.v1 event %s for book %s',
      event.id,
      event.payload.bookId,
    )
  }
}
