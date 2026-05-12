import slugify from 'slugify'

import { ValueObject } from '#shared/domain/value-object.js'

type SlugProps = {
  value: string
}

export class Slug extends ValueObject<SlugProps> {
  private constructor(props: SlugProps) {
    super(props)
  }

  static create(value: string): Slug {
    return new Slug({ value: slugify(value, { strict: true, lower: true }) })
  }

  static from(value: string): Slug {
    return Slug.create(value)
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
