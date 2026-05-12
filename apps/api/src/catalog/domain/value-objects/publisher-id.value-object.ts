import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type PublisherIdProps = {
  value: string
}

export class PublisherId extends ValueObject<PublisherIdProps> {
  private constructor(props: PublisherIdProps) {
    super(props)
  }

  static create() {
    return new PublisherId({ value: randomUUID() })
  }

  static from(value: string): PublisherId {
    Guard.againstInvalidUuid(value, 'Publisher id is required')
    return new PublisherId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
