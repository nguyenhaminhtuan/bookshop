import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class TagNotFoundError extends ApplicationError {
  readonly code = 'TAG_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(tagId: string) {
    super(`Can not find any tag with ${tagId}`)
  }
}
