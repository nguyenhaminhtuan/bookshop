import { Inject, Injectable, Logger } from '@nestjs/common'

import { Publisher } from '#catalog/domain/publisher.aggregate.js'
import { PUBLISHER_REPOSITORY, type PublisherRepository } from '#catalog/domain/repositories/index.js'
import { PublisherId } from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

import type { CreatePublisherDto, UpdatePublisherDto } from '../dtos/index.js'
import { PublisherNotFoundError } from '../errors/publisher.application-errors.js'

@Injectable()
export class PublisherCommandService {
  private readonly logger = new Logger(PublisherCommandService.name)

  constructor(
    @Inject(PUBLISHER_REPOSITORY)
    private readonly publisherRepo: PublisherRepository,
  ) {}

  @Transactional()
  async createPublisher(dto: CreatePublisherDto): Promise<{ id: string }> {
    this.logger.debug('Creating publisher with data %o', dto)
    const publisher = Publisher.create({
      id: PublisherId.create(),
      name: dto.name,
      bio: dto.bio ?? null,
      image: dto.image ?? null,
    })
    await this.publisherRepo.add(publisher)
    await this.publisherRepo.save(publisher)
    this.logger.log('Publisher id: %s created', publisher.id)
    return { id: publisher.id.value }
  }

  @Transactional()
  async updatePublisher(id: string, dto: UpdatePublisherDto): Promise<void> {
    this.logger.debug('Updating publisher id: %s with data %o', id, dto)
    const publisher = await this.publisherRepo.findById(PublisherId.from(id))
    if (!publisher) {
      throw new PublisherNotFoundError(id)
    }

    publisher.update({
      name: dto.name,
      bio: dto.bio,
      image: dto.image,
    })
    await this.publisherRepo.save(publisher)
    this.logger.log('Publisher id: %s updated', id)
  }
}
