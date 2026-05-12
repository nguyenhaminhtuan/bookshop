import { AggregateRoot } from '#shared/domain/aggregate-root.js'

import { BookStatus } from './enums/book.enums.js'
import { CannotDiscontinueBookError, CannotPublishBookError } from './errors/book-domain.errors.js'
import { BookDiscontinuedDomainEvent } from './events/book-discontinued.domain-event.js'
import {
  BookPriceChangedDomainEvent,
  BookPublishedDomainEvent,
  BookRenamedDomainEvent,
} from './events/index.js'
import {
  Slug,
  TagId,
  type AuthorId,
  type BookId,
  type BookImage,
  type BookTitle,
  type CategoryId,
  type Dimension,
  type DistributorId,
  type ISBN,
  type Money,
  type PublisherId,
} from './value-objects/index.js'

interface CreateBookProps {
  id: BookId
  isbn: ISBN
  title: BookTitle
  description: string
  price: Money
  dimension: Dimension
  releaseDate: string
  pageCount: number | null
  coverMaterial: string | null
  images: BookImage[]
  authorIds: AuthorId[]
  categoryId: CategoryId
  tagIds: TagId[]
  publisherId: PublisherId
  distributorId: DistributorId
}

interface RehydrateBookProps {
  id: BookId
  slug: Slug
  isbn: ISBN
  title: BookTitle
  description: string
  price: Money
  dimension: Dimension
  releaseDate: string
  pageCount: number | null
  coverMaterial: string | null
  images: BookImage[]
  status: BookStatus
  publishedAt: Date | null
  discontinuedAt: Date | null
  authorIds: AuthorId[]
  categoryId: CategoryId
  tagIds: TagId[]
  publisherId: PublisherId
  distributorId: DistributorId
  createdAt: Date
  updatedAt: Date
}

interface UpdateBookInfoProps {
  isbn: ISBN
  description: string
  dimension: Dimension
  releaseDate: string
  pageCount: number | null
  coverMaterial: string | null
}

export class Book extends AggregateRoot<BookId> {
  private constructor(
    id: BookId,
    private _slug: Slug,
    private _isbn: ISBN,
    private _title: BookTitle,
    private _description: string,
    private _price: Money,
    private _dimension: Dimension,
    private _releaseDate: string,
    private _pageCount: number | null,
    private _coverMaterial: string | null,
    private _images: readonly BookImage[],
    private _status: BookStatus,
    private _publishedAt: Date | null,
    private _discontinuedAt: Date | null,
    private _authorIds: readonly AuthorId[],
    private _categoryId: CategoryId,
    private _tagIds: readonly TagId[],
    private _publisherId: PublisherId,
    private _distributorId: DistributorId,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id)
  }

  get slug() {
    return this._slug
  }
  get isbn() {
    return this._isbn
  }
  get title() {
    return this._title
  }
  get description() {
    return this._description
  }
  get price() {
    return this._price
  }
  get dimension() {
    return this._dimension
  }
  get releaseDate() {
    return this._releaseDate
  }
  get pageCount() {
    return this._pageCount
  }
  get coverMaterial() {
    return this._coverMaterial
  }
  get images() {
    return this._images
  }
  get status() {
    return this._status
  }
  get publishedAt() {
    return this._publishedAt ? new Date(this._publishedAt) : null
  }
  get discontinuedAt() {
    return this._discontinuedAt ? new Date(this._discontinuedAt) : null
  }
  get authorIds() {
    return [...this._authorIds]
  }
  get categoryId() {
    return this._categoryId
  }
  get tagIds() {
    return [...this._tagIds]
  }
  get publisherId() {
    return this._publisherId
  }
  get distributorId() {
    return this._distributorId
  }
  get createdAt() {
    return new Date(this._createdAt)
  }
  get updatedAt() {
    return new Date(this._updatedAt)
  }

  static create(props: CreateBookProps) {
    const now = new Date()
    return new Book(
      props.id,
      Slug.from(props.title.value),
      props.isbn,
      props.title,
      props.description,
      props.price,
      props.dimension,
      props.releaseDate,
      props.pageCount,
      props.coverMaterial,
      props.images,
      BookStatus.Draft,
      null,
      null,
      props.authorIds,
      props.categoryId,
      props.tagIds,
      props.publisherId,
      props.distributorId,
      now,
      now,
    )
  }

  static rehydrate(props: RehydrateBookProps): Book {
    return new Book(
      props.id,
      props.slug,
      props.isbn,
      props.title,
      props.description,
      props.price,
      props.dimension,
      props.releaseDate,
      props.pageCount,
      props.coverMaterial,
      props.images,
      props.status,
      props.publishedAt ? new Date(props.publishedAt) : null,
      props.discontinuedAt ? new Date(props.discontinuedAt) : null,
      [...props.authorIds],
      props.categoryId,
      [...props.tagIds],
      props.publisherId,
      props.distributorId,
      new Date(props.createdAt),
      new Date(props.updatedAt),
    )
  }

  rename(props: { title: BookTitle }) {
    if (this._title.equals(props.title)) {
      return
    }

    const oldTitle = this._title
    const newTitle = props.title
    const oldSlug = this._slug
    const newSlug = Slug.from(newTitle.value)
    this._title = newTitle
    this._slug = newSlug
    this._updatedAt = new Date()
    this.addDomainEvent(new BookRenamedDomainEvent(this.id, oldTitle, newTitle, oldSlug, newSlug))
  }

  changePrice(props: { price: Money }) {
    if (this._price.equals(props.price)) {
      return
    }

    const oldPrice = this._price
    const newPrice = props.price
    this._price = newPrice
    this._updatedAt = new Date()
    this.addDomainEvent(new BookPriceChangedDomainEvent(this.id, oldPrice, newPrice))
  }

  publish() {
    if (this._status === BookStatus.Published) {
      return
    }

    if (this._status !== BookStatus.Draft) {
      throw new CannotPublishBookError(`book must be in ${BookStatus.Draft} status`)
    }

    this._status = BookStatus.Published
    this._publishedAt = new Date()
    this._updatedAt = new Date()
    this.addDomainEvent(
      new BookPublishedDomainEvent(this.id, this._title, {
        categoryId: this._categoryId,
        authorIds: this._authorIds,
        tagIds: this._tagIds,
      }),
    )
  }

  discontinue() {
    if (this._status === BookStatus.Discontinued) {
      return
    }

    if (this._status !== BookStatus.Published) {
      throw new CannotDiscontinueBookError(this._status)
    }

    this._status = BookStatus.Discontinued
    this._discontinuedAt = new Date()
    this._updatedAt = new Date()
    this.addDomainEvent(new BookDiscontinuedDomainEvent(this.id))
  }

  updateInfo(props: UpdateBookInfoProps) {
    if (!this._isbn.equals(props.isbn)) {
      this._isbn = props.isbn
    }

    if (!this._dimension.equals(props.dimension)) {
      this._dimension = props.dimension
    }

    this._description = props.description
    this._releaseDate = props.releaseDate
    this._pageCount = props.pageCount
    this._coverMaterial = props.coverMaterial
    this._updatedAt = new Date()
  }

  addTags(props: { tagIds: TagId[] }) {
    const currentTagIds = this._tagIds.map((tagId) => tagId.value)
    const newAddedTagIds = props.tagIds.map((tagId) => tagId.value)
    const newTagIds = new Set(...currentTagIds, ...newAddedTagIds)
    this._tagIds = [...newTagIds].map((tagId) => TagId.from(tagId))
    this._updatedAt = new Date()
  }

  removeTags(props: { tagIds: TagId[] }) {
    const currentTagIds = this._tagIds.map((tagId) => tagId.value)
    const removedTagIds = props.tagIds.map((tagId) => tagId.value)
    const newTagIds = new Set(...currentTagIds).difference(new Set(...removedTagIds))
    this._tagIds = [...newTagIds].map((tagId) => TagId.from(tagId))
    this._updatedAt = new Date()
  }
}
