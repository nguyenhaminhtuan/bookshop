import { ValueObject } from '#shared/domain/value-object.js'

type ISBNProps = {
  value: string
}

export class ISBN extends ValueObject<ISBNProps> {
  private constructor(props: ISBNProps) {
    super(props)
  }

  static create(value: string): ISBN {
    // Implement validation
    return new ISBN({ value })
  }

  static from(value: string): ISBN {
    return new ISBN({ value })
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
