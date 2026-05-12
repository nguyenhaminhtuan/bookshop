import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class PublisherNotFoundError extends ApplicationError {
  readonly code = 'PUBLISHER_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(publisherId: string) {
    super(`Can not find any publisher with ${publisherId}`)
  }
}
