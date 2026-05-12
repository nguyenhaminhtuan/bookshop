import { Inject, Injectable, Logger } from '@nestjs/common'

import { Distributor } from '#catalog/domain/distributor.aggregate.js'
import {
  DISTRIBUTOR_REPOSITORY,
  type DistributorRepository,
} from '#catalog/domain/repositories/index.js'
import { DistributorId } from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

import type { CreateDistributorDto, UpdateDistributorDto } from '../dtos/index.js'
import { DistributorNotFoundError } from '../errors/distributor.application-errors.js'

@Injectable()
export class DistributorCommandService {
  private readonly logger = new Logger(DistributorCommandService.name)

  constructor(
    @Inject(DISTRIBUTOR_REPOSITORY)
    private readonly distributorRepo: DistributorRepository,
  ) {}

  @Transactional()
  async createDistributor(dto: CreateDistributorDto): Promise<{ id: string }> {
    this.logger.debug('Creating distributor with data %o', dto)
    const distributor = Distributor.create({
      id: DistributorId.create(),
      name: dto.name,
      bio: dto.bio ?? null,
      image: dto.image ?? null,
    })
    await this.distributorRepo.add(distributor)
    await this.distributorRepo.save(distributor)
    this.logger.log('Distributor id: %s created', distributor.id)
    return { id: distributor.id.value }
  }

  @Transactional()
  async updateDistributor(id: string, dto: UpdateDistributorDto): Promise<void> {
    this.logger.debug('Updating distributor id: %s with data %o', id, dto)
    const distributor = await this.distributorRepo.findById(DistributorId.from(id))
    if (!distributor) {
      throw new DistributorNotFoundError(id)
    }

    distributor.update({
      name: dto.name,
      bio: dto.bio,
      image: dto.image,
    })
    await this.distributorRepo.save(distributor)
    this.logger.log('Distributor id: %s updated', id)
  }
}
