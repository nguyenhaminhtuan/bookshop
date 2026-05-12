import { DomainInvariantError } from '#shared/domain/domain-invariant.error.js'
import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

export type MoneyProps = {
  amount: number
  currency: string
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props)
  }

  static create(params: MoneyProps): Money {
    Guard.againstInvalidNumber(params.amount, 'Money amount')
    Guard.againstZeroOrNegative(params.amount, 'Money amount')
    const currency = params.currency.trim().toUpperCase()
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new DomainInvariantError('Currency must be a 3-letter code')
    }

    return new Money({
      amount: params.amount,
      currency,
    })
  }

  static from(props: MoneyProps): Money {
    return Money.create(props)
  }

  get amount(): number {
    return this.props.amount
  }

  get currency(): string {
    return this.props.currency
  }

  toPrimitives(): MoneyProps {
    return {
      amount: this.amount,
      currency: this.currency,
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new DomainInvariantError('Cannot add money with different currency')
    }

    return Money.create({
      amount: this.amount + other.amount,
      currency: this.currency,
    })
  }

  multiply(multiplier: number): Money {
    if (!Number.isFinite(multiplier) || multiplier < 0) {
      throw new DomainInvariantError('Money multiplier must not be negative')
    }

    return Money.create({
      amount: this.amount * multiplier,
      currency: this.currency,
    })
  }
}
