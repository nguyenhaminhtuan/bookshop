import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class AuthorNotFoundError extends ApplicationError {
  readonly code = 'AUTHOR_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(authorId: string) {
    super(`Can not find any author with ${authorId}`)
  }
}
