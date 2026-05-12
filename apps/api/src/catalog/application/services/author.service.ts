import { Inject, Injectable, Logger } from '@nestjs/common'

import { Author } from '#catalog/domain/author.aggregate.js'
import { AUTHOR_REPOSITORY, type AuthorRepository } from '#catalog/domain/repositories/index.js'
import {
  AuthorId,
  SocialLink,
  type SocialPlatform,
} from '#catalog/domain/value-objects/index.js'
import { Transactional } from '#shared/decorators/transactional.decorator.js'

import type { CreateAuthorDto, SocialLinkDto, UpdateAuthorDto } from '../dtos/index.js'
import { AuthorNotFoundError } from '../errors/author.application-errors.js'

@Injectable()
export class AuthorCommandService {
  private readonly logger = new Logger(AuthorCommandService.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepo: AuthorRepository,
  ) {}

  @Transactional()
  async createAuthor(dto: CreateAuthorDto): Promise<{ id: string }> {
    this.logger.debug('Creating author with data %o', dto)
    const author = Author.create({
      id: AuthorId.create(),
      name: dto.name,
      bio: dto.bio ?? null,
      image: dto.image ?? null,
      socialLinks: (dto.socialLinks ?? []).map(toSocialLink),
    })
    await this.authorRepo.add(author)
    await this.authorRepo.save(author)
    this.logger.log('Author id: %s created', author.id)
    return { id: author.id.value }
  }

  @Transactional()
  async updateAuthor(id: string, dto: UpdateAuthorDto): Promise<void> {
    this.logger.debug('Updating author id: %s with data %o', id, dto)
    const author = await this.authorRepo.findById(AuthorId.from(id))
    if (!author) {
      throw new AuthorNotFoundError(id)
    }

    author.update({
      name: dto.name,
      bio: dto.bio,
      image: dto.image,
      socialLinks: dto.socialLinks.map(toSocialLink),
    })
    await this.authorRepo.save(author)
    this.logger.log('Author id: %s updated', id)
  }
}

function toSocialLink(dto: SocialLinkDto): SocialLink {
  return SocialLink.create({ platform: dto.platform as SocialPlatform, url: dto.url })
}
