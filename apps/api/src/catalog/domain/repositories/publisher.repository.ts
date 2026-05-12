import type { Publisher } from '../publisher.aggregate.js'
import type { PublisherId } from '../value-objects/index.js'

export const PUBLISHER_REPOSITORY = Symbol('PUBLISHER_REPOSITORY')

export interface PublisherRepository {
  add(publisher: Publisher): Promise<void>
  findById(id: PublisherId): Promise<Publisher | null>
  save(entity: Publisher): Promise<void>
}
