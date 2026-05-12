import type { Author } from '../author.aggregate.js'
import type { AuthorId } from '../value-objects/index.js'

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY')

export interface AuthorRepository {
  add(author: Author): Promise<void>
  findById(id: AuthorId): Promise<Author | null>
  save(entity: Author): Promise<void>
}
