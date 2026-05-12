import { DomainError } from './domain-error.js'

export class DomainInvariantError extends DomainError {
  readonly code = 'DOMAIN_INVARIANT_VIOLATED'

  constructor(message = 'Domain invariant violated') {
    super(message)
  }
}
