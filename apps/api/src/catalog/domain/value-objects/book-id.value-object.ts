import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type BookIdProps = {
  value: string
}

export class BookId extends ValueObject<BookIdProps> {
  private constructor(props: BookIdProps) {
    super(props)
  }

  static create() {
    return new BookId({ value: randomUUID() })
  }

  static from(value: string): BookId {
    Guard.againstInvalidUuid(value, 'Book id is required')
    return new BookId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
