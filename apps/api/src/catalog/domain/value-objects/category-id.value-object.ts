import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type CategoryIdProps = {
  value: string
}

export class CategoryId extends ValueObject<CategoryIdProps> {
  private constructor(props: CategoryIdProps) {
    super(props)
  }

  static create() {
    return new CategoryId({ value: randomUUID() })
  }

  static from(value: string): CategoryId {
    Guard.againstInvalidUuid(value, 'Category id is required')
    return new CategoryId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
