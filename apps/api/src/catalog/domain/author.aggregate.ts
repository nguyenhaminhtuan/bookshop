import { AggregateRoot } from '#shared/domain/aggregate-root.js'

import { Slug, type AuthorId, type SocialLink } from './value-objects/index.js'

interface CreateAuthorProps {
  id: AuthorId
  name: string
  bio?: string | null
  image?: string | null
  socialLinks?: SocialLink[]
}

interface RehydrateAuthorProps {
  id: AuthorId
  slug: Slug
  name: string
  bio: string | null
  image: string | null
  socialLinks: SocialLink[]
  createdAt: Date
  updatedAt: Date
}

interface UpdateAuthorProps {
  name: string
  bio: string | null
  image: string | null
  socialLinks: SocialLink[]
}

export class Author extends AggregateRoot<AuthorId> {
  private constructor(
    readonly id: AuthorId,
    private _slug: Slug,
    private _name: string,
    private _bio: string | null,
    private _image: string | null,
    private _socialLinks: SocialLink[],
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id)
  }

  get slug() {
    return this._slug
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
  get socialLinks() {
    return this._socialLinks
  }
  get createdAt() {
    return this._createdAt
  }
  get updatedAt() {
    return this._updatedAt
  }

  static create(props: CreateAuthorProps): Author {
    const now = new Date()
    return new Author(
      props.id,
      Slug.create(props.name),
      props.name,
      props.bio ?? null,
      props.image ?? null,
      props.socialLinks ?? [],
      now,
      now,
    )
  }

  static rehydrate(props: RehydrateAuthorProps): Author {
    return new Author(
      props.id,
      props.slug,
      props.name,
      props.bio,
      props.image,
      [...props.socialLinks],
      new Date(props.createdAt),
      new Date(props.updatedAt),
    )
  }

  update(props: UpdateAuthorProps): void {
    this._name = props.name
    this._slug = Slug.create(props.name)
    this._bio = props.bio
    this._image = props.image
    this._socialLinks = [...props.socialLinks]
    this._updatedAt = new Date()
  }
}
