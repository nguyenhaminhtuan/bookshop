import { ValueObject } from '#shared/domain/value-object.js'

type BookImageProps = {
  url: string
}

export class BookImage extends ValueObject<BookImageProps> {
  private constructor(props: BookImageProps) {
    super(props)
  }

  static create(props: BookImageProps): BookImage {
    return new BookImage({ url: props.url })
  }

  get url(): string {
    return this.props.url
  }
}
