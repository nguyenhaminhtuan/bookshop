import { HttpStatus } from '@nestjs/common'

import { ApplicationError } from '#shared/application.error.js'

export class CategoryNotFoundError extends ApplicationError {
  readonly code = 'CATEGORY_NOT_FOUND'
  readonly statusCode = HttpStatus.NOT_FOUND

  constructor(categoryId: string) {
    super(`Can not find any category with ${categoryId}`)
  }
}
