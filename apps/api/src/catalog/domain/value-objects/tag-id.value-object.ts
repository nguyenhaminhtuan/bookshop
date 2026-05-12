import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type TagIdProps = {
  value: string
}

export class TagId extends ValueObject<TagIdProps> {
  private constructor(props: TagIdProps) {
    super(props)
  }

  static create() {
    return new TagId({ value: randomUUID() })
  }

  static from(value: string): TagId {
    Guard.againstInvalidUuid(value, 'Tag id is required')
    return new TagId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
