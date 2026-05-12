import type { Category } from '../category.aggregate.js'
import type { CategoryId } from '../value-objects/index.js'

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY')

export interface CategoryRepository {
  add(category: Category): Promise<void>
  findById(id: CategoryId): Promise<Category | null>
  save(entity: Category): Promise<void>
}
