import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type SeriesIdProps = {
  value: string
}

export class SeriesId extends ValueObject<SeriesIdProps> {
  private constructor(props: SeriesIdProps) {
    super(props)
  }

  static create() {
    return new SeriesId({ value: randomUUID() })
  }

  static from(value: string): SeriesId {
    Guard.againstInvalidUuid(value, 'Series id is required')
    return new SeriesId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
