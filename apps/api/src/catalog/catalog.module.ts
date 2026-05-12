import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Inject, Module, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices'

import {
  CqrsDomainEventDispatcher,
  DOMAIN_EVENT_DISPATCHER,
} from '#shared/domain-event-dispatcher.js'
import { OUTBOX_REPOSITORY, OutboxEvent, OutboxMikroRepository } from '#shared/outbox/index.js'

import { CatalogIntegrationEventMapper } from './application/catalog-integration-event.mapper.js'
import { BOOK_READ_REPOSITORY } from './application/read-models/index.js'
import {
  AuthorCommandService,
  BookCommandService,
  BookQueryService,
  CategoryCommandService,
  DistributorCommandService,
  PublisherCommandService,
  TagCommandService,
} from './application/services/index.js'
import {
  AUTHOR_REPOSITORY,
  BOOK_REPOSITORY,
  CATEGORY_REPOSITORY,
  DISTRIBUTOR_REPOSITORY,
  PUBLISHER_REPOSITORY,
  TAG_REPOSITORY,
} from './domain/repositories/index.js'
import {
  AuthorEntity,
  BookEntity,
  BookStatsEntity,
  CategoryEntity,
  DistributorEntity,
  PublisherEntity,
  TagEntity,
} from './infrastructure/entities/index.js'
import { BookMikroReadRepository } from './infrastructure/read-repositories/index.js'
import {
  AuthorMikroRepository,
  BookMikroRepository,
  CategoryMikroRepository,
  DistributorMikroRepository,
  PublisherMikroRepository,
  TagMikroRepository,
} from './infrastructure/repositories/index.js'
import {
  AuthorAdminController,
  BookAdminController,
  CategoryAdminController,
  DistributorAdminController,
  PublisherAdminController,
  StorefrontController,
  TagAdminController,
} from './presentation/controllers/index.js'

@Module({
  imports: [
    MikroOrmModule.forFeature([
      OutboxEvent,
      AuthorEntity,
      BookEntity,
      BookStatsEntity,
      CategoryEntity,
      DistributorEntity,
      PublisherEntity,
      TagEntity,
    ]),
    ClientsModule.register({
      clients: [
        {
          name: 'KAFKA_PRODUCER_SERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'catalog-service-producer',
              brokers: ['localhost:9092'],
            },
            producer: {
              allowAutoTopicCreation: true,
              idempotent: true,
              retry: {
                retries: 5,
                maxRetryTime: 30000,
              },
            },
          },
        },
      ],
    }),
  ],
  providers: [
    { provide: AUTHOR_REPOSITORY, useClass: AuthorMikroRepository },
    { provide: BOOK_REPOSITORY, useClass: BookMikroRepository },
    { provide: BOOK_READ_REPOSITORY, useClass: BookMikroReadRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryMikroRepository },
    { provide: DISTRIBUTOR_REPOSITORY, useClass: DistributorMikroRepository },
    { provide: PUBLISHER_REPOSITORY, useClass: PublisherMikroRepository },
    { provide: TAG_REPOSITORY, useClass: TagMikroRepository },
    { provide: OUTBOX_REPOSITORY, useClass: OutboxMikroRepository },
    { provide: DOMAIN_EVENT_DISPATCHER, useClass: CqrsDomainEventDispatcher },
    AuthorCommandService,
    BookCommandService,
    BookQueryService,
    CategoryCommandService,
    DistributorCommandService,
    PublisherCommandService,
    TagCommandService,
    CatalogIntegrationEventMapper,
  ],
  controllers: [
    AuthorAdminController,
    BookAdminController,
    StorefrontController,
    CategoryAdminController,
    DistributorAdminController,
    PublisherAdminController,
    TagAdminController,
  ],
})
export class CatalogModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_PRODUCER_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    await this.kafkaClient.connect()
  }

  async onModuleDestroy() {
    await this.kafkaClient.close()
  }
}
