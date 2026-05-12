import type { Distributor } from '../distributor.aggregate.js'
import type { DistributorId } from '../value-objects/index.js'

export const DISTRIBUTOR_REPOSITORY = Symbol('DISTRIBUTOR_REPOSITORY')

export interface DistributorRepository {
  add(distributor: Distributor): Promise<void>
  findById(id: DistributorId): Promise<Distributor | null>
  save(entity: Distributor): Promise<void>
}
