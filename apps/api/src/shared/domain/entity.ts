export abstract class Entity<TId> {
  protected constructor(public readonly id: TId) {}

  equals(other: Entity<TId> | null | undefined): boolean {
    if (!other) return false

    if (this === other) return true

    return this.id === other.id
  }
}
