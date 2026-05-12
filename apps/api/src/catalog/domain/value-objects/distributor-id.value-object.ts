import { randomUUID } from 'node:crypto'

import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type DistributorIdProps = {
  value: string
}

export class DistributorId extends ValueObject<DistributorIdProps> {
  private constructor(props: DistributorIdProps) {
    super(props)
  }

  static create() {
    return new DistributorId({ value: randomUUID() })
  }

  static from(value: string): DistributorId {
    Guard.againstInvalidUuid(value, 'Distributor id is required')
    return new DistributorId({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
