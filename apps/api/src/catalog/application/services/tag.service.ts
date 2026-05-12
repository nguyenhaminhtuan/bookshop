import { Inject, Injectable, Logger } from '@nestjs/common'

import { TAG_REPOSITORY, type TagRepository } from '#catalog/domain/repositories/index.js'
import { Tag } from '#catalog/domain/tag.aggregate.js'
import { TagId } from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

import type { CreateTagDto, UpdateTagDto } from '../dtos/index.js'
import { TagNotFoundError } from '../errors/tag.application-errors.js'

@Injectable()
export class TagCommandService {
  private readonly logger = new Logger(TagCommandService.name)

  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepo: TagRepository,
  ) {}

  @Transactional()
  async createTag(dto: CreateTagDto): Promise<{ id: string }> {
    this.logger.debug('Creating tag with data %o', dto)
    const tag = Tag.create({
      id: TagId.create(),
      name: dto.name,
    })
    await this.tagRepo.add(tag)
    await this.tagRepo.save(tag)
    this.logger.log('Tag id: %s created', tag.id)
    return { id: tag.id.value }
  }

  @Transactional()
  async updateTag(id: string, dto: UpdateTagDto): Promise<void> {
    this.logger.debug('Updating tag id: %s with data %o', id, dto)
    const tag = await this.tagRepo.findById(TagId.from(id))
    if (!tag) {
      throw new TagNotFoundError(id)
    }

    tag.update({ name: dto.name })
    await this.tagRepo.save(tag)
    this.logger.log('Tag id: %s updated', id)
  }
}
