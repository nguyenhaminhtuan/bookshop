import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

type BookTitleProps = {
  value: string
}

export class BookTitle extends ValueObject<BookTitleProps> {
  private constructor(props: BookTitleProps) {
    super(props)
  }

  static create(value: string): BookTitle {
    Guard.againstEmptyString(value, 'Book title')
    Guard.againstInvalidLength(value, 'Book title', 1, 500)
    return new BookTitle({ value })
  }

  static from(value: string) {
    return BookTitle.create(value)
  }

  get value(): string {
    return this.props.value
  }

  toString(): string {
    return this.value
  }
}
