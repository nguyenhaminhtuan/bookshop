import { AggregateRoot } from '#shared/domain/aggregate-root.js'

import { Slug, type TagId } from './value-objects/index.js'

interface CreateTagProps {
  id: TagId
  name: string
}

interface RehydrateTagProps {
  id: TagId
  name: string
  slug: Slug
  createdAt: Date
  updatedAt: Date
}

interface UpdateTagProps {
  name: string
}

export class Tag extends AggregateRoot<TagId> {
  private constructor(
    id: TagId,
    private _name: string,
    private _slug: Slug,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id)
  }

  get name() {
    return this._name
  }
  get slug() {
    return this._slug
  }
  get createdAt() {
    return new Date(this._createdAt)
  }
  get updatedAt() {
    return new Date(this._updatedAt)
  }

  static create(props: CreateTagProps) {
    const now = new Date()
    return new Tag(props.id, props.name, Slug.from(props.name), now, now)
  }

  static rehydrate(props: RehydrateTagProps) {
    return new Tag(
      props.id,
      props.name,
      props.slug,
      new Date(props.createdAt),
      new Date(props.updatedAt),
    )
  }

  update(props: UpdateTagProps): void {
    this._name = props.name
    this._slug = Slug.from(props.name)
    this._updatedAt = new Date()
  }
}
