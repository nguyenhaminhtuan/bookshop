import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class DistributorNotFoundError extends ApplicationError {
  readonly code = 'DISTRIBUTOR_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(distributorId: string) {
    super(`Can not find any distributor with ${distributorId}`)
  }
}
