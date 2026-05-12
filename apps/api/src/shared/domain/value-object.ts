import { dequal } from 'dequal'

export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected constructor(protected readonly props: TProps) {
    Object.freeze(this.props)
    Object.freeze(this)
  }

  equals(other: ValueObject<TProps> | null | undefined): boolean {
    if (!other) return false
    return dequal(this.props, other.props)
  }

  protected getProps(): TProps {
    return this.props
  }
}
