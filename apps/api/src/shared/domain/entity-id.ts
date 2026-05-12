import { DomainInvariantError } from './domain-invariant.error.js'

export abstract class EntityId {
  protected constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new DomainInvariantError('Id must not be empty')
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: unknown): boolean {
    if (other === this) return true

    if (!(other instanceof EntityId)) {
      return false
    }

    return other.constructor === this.constructor && other.value === this.value
  }
}
