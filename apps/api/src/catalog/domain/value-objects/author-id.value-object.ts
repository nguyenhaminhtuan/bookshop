import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type AuthorIdProps = {
  value: string
}

export class AuthorId extends ValueObject<AuthorIdProps> {
  private constructor(props: AuthorIdProps) {
    super(props)
  }

  static create() {
    return new AuthorId({ value: randomUUID() })
  }

  static from(value: string): AuthorId {
    Guard.againstInvalidUuid(value, 'Author id is required')
    return new AuthorId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
