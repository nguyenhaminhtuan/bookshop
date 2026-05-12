import { AggregateRoot } from '#shared/domain/aggregate-root.js'

import { Slug, type CategoryId } from './value-objects/index.js'

type CreateCategoryProps = {
  id: CategoryId
  name: string
  description: string | null
  image: string | null
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

interface RehydrateCategoryProps {
  id: CategoryId
  name: string
  slug: Slug
  description: string | null
  image: string | null
  displayOrder: number
  parentId: CategoryId | null
  createdAt: Date
  updatedAt: Date
}

interface UpdateCategoryInfoProps {
  name: string
  description: string | null
  image: string | null
  displayOrder: number
}

export class Category extends AggregateRoot<CategoryId> {
  private constructor(
    readonly id: CategoryId,
    private _name: string,
    private _slug: Slug,
    private _description: string | null,
    private _image: string | null,
    private _displayOrder: number,
    private _parentId: CategoryId | null,
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
  get description() {
    return this._description
  }
  get image() {
    return this._image
  }
  get displayOrder() {
    return this._displayOrder
  }
  get parentId() {
    return this._parentId
  }
  get createdAt() {
    return new Date(this._createdAt)
  }
  get updatedAt() {
    return new Date(this._updatedAt)
  }

  static create(props: CreateCategoryProps & { parentId?: CategoryId | null }): Category {
    const now = new Date()
    return props.parentId !== undefined
      ? Category.createSubCategory({
          ...props,
          parentId: props.parentId,
          createdAt: now,
          updatedAt: now,
        })
      : Category.createRoot({
          ...props,
          createdAt: now,
          updatedAt: now,
        })
  }

  static rehydrate(props: RehydrateCategoryProps): Category {
    return new Category(
      props.id,
      props.name,
      props.slug,
      props.description,
      props.image,
      props.displayOrder,
      props.parentId,
      new Date(props.createdAt),
      new Date(props.updatedAt),
    )
  }

  private static createRoot(props: CreateCategoryProps): Category {
    return new Category(
      props.id,
      props.name,
      Slug.create(props.name),
      props.description,
      props.image,
      props.displayOrder,
      null,
      props.createdAt,
      props.updatedAt,
    )
  }

  private static createSubCategory(
    props: CreateCategoryProps & { parentId: CategoryId | null },
  ): Category {
    return new Category(
      props.id,
      props.name,
      Slug.create(props.name),
      props.description,
      props.image,
      props.displayOrder,
      props.parentId,
      props.createdAt,
      props.updatedAt,
    )
  }

  isRoot(): boolean {
    return this._parentId === null
  }

  isSubCategory(): boolean {
    return this._parentId !== null
  }

  updateInfo(props: UpdateCategoryInfoProps) {
    this._name = props.name
    this._description = props.description
    this._image = props.image
    this._displayOrder = props.displayOrder
    this._updatedAt = new Date()
  }
}
