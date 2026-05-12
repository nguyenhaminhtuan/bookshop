import type { Tag } from '../tag.aggregate.js'
import type { TagId } from '../value-objects/index.js'

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY')

export interface TagRepository {
  add(tag: Tag): Promise<void>
  findById(id: TagId): Promise<Tag | null>
  save(entity: Tag): Promise<void>
}
