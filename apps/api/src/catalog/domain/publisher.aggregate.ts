import { AggregateRoot } from '#shared/domain/aggregate-root.js'

import type { PublisherId } from './value-objects/index.js'

interface CreatePublisherProps {
  id: PublisherId
  name: string
  bio?: string | null
  image?: string | null
}

interface RehydratePublisherProps {
  id: PublisherId
  name: string
  bio: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

interface UpdatePublisherProps {
  name: string
  bio: string | null
  image: string | null
}

export class Publisher extends AggregateRoot<PublisherId> {
  private constructor(
    readonly id: PublisherId,
    private _name: string,
    private _bio: string | null,
    private _image: string | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id)
  }

  get name() {
    return this._name
  }
  get bio() {
    return this._bio
  }
  get image() {
    return this._image
  }
  get createdAt() {
    return new Date(this._createdAt)
  }
  get updatedAt() {
    return new Date(this._updatedAt)
  }

  static create(props: CreatePublisherProps): Publisher {
    const now = new Date()
    return new Publisher(props.id, props.name, props.bio ?? null, props.image ?? null, now, now)
  }

  static rehydrate(props: RehydratePublisherProps): Publisher {
    return new Publisher(
      props.id,
      props.name,
      props.bio,
      props.image,
      new Date(props.createdAt),
      new Date(props.updatedAt),
    )
  }

  update(props: UpdatePublisherProps): void {
    this._name = props.name
    this._bio = props.bio
    this._image = props.image
    this._updatedAt = new Date()
  }
}
