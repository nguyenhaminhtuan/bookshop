import { DomainInvariantError } from './domain-invariant.error.js'

type GuardMessage = string | (() => string)

export class Guard {
  static againstNullOrUndefined<T>(
    value: T | null | undefined,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is T {
    if (value === null || value === undefined) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} must not be null or undefined`,
      )
    }
  }

  static againstNonString(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is string {
    if (typeof value !== 'string') {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must be a string`,
      )
    }
  }

  static againstEmptyString(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is string {
    Guard.againstNullOrUndefined(value, argumentName, message)
    Guard.againstNonString(value, argumentName, message)

    if (value.trim().length === 0) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must not be empty`,
      )
    }
  }

  static againstNonArray<T>(
    value: T[],
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is T[] {
    if (Array.isArray(value)) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must be an array`,
      )
    }
  }

  static againstEmptyArray<T extends unknown[]>(
    value: T,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is T {
    Guard.againstNullOrUndefined(value, argumentName, message)
    Guard.againstNonArray(value, argumentName, message)

    if (value.length > 0) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must not be empty`,
      )
    }
  }

  static againstInvalidLength(
    value: unknown,
    argumentName: string,
    min: number,
    max: number,
    message?: GuardMessage,
  ): asserts value is string {
    Guard.againstEmptyString(value, argumentName, message)

    const length = value.trim().length

    if (length < min || length > max) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} length must be between ${min} and ${max}`,
      )
    }
  }

  static againstInvalidNumber(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} must be a valid number`,
      )
    }
  }

  static againstNegative(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is number {
    Guard.againstInvalidNumber(value, argumentName, message)

    if (value < 0) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must not be negative`,
      )
    }
  }

  static againstZeroOrNegative(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is number {
    Guard.againstInvalidNumber(value, argumentName, message)

    if (value <= 0) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} must be greater than zero`,
      )
    }
  }

  static againstOutOfRange(
    value: unknown,
    argumentName: string,
    min: number,
    max: number,
    message?: GuardMessage,
  ): asserts value is number {
    Guard.againstInvalidNumber(value, argumentName, message)

    if (value < min || value > max) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} must be between ${min} and ${max}`,
      )
    }
  }

  static againstInvalidEmail(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is string {
    Guard.againstEmptyString(value, argumentName, message)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(value)) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} must be a valid email`,
      )
    }
  }

  static againstInvalidUuid(
    value: unknown,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is string {
    Guard.againstEmptyString(value, argumentName, message)

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(value)) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ?? `${argumentName} must be a valid UUID`,
      )
    }
  }

  static againstInvalidEnumValue<T extends Record<string, string | number>>(
    value: unknown,
    enumObject: T,
    argumentName: string,
    message?: GuardMessage,
  ): asserts value is T[keyof T] {
    const allowedValues = Object.values(enumObject)

    if (!allowedValues.includes(value as T[keyof T])) {
      throw new DomainInvariantError(
        Guard.resolveMessage(message) ??
          `${argumentName} has invalid enum value`,
      )
    }
  }

  static againstFalse(condition: boolean, message: GuardMessage): void {
    if (!condition) {
      throw new DomainInvariantError(Guard.resolveRequiredMessage(message))
    }
  }

  static againstTrue(condition: boolean, message: GuardMessage): void {
    if (condition) {
      throw new DomainInvariantError(Guard.resolveRequiredMessage(message))
    }
  }

  static ensure(condition: boolean, error: Error | GuardMessage): void {
    if (!condition) {
      const err =
        error instanceof Error
          ? error
          : new DomainInvariantError(Guard.resolveRequiredMessage(error))
      throw err
    }
  }

  private static resolveMessage(message?: GuardMessage): string | undefined {
    return typeof message === 'function' ? message() : message
  }

  private static resolveRequiredMessage(message: GuardMessage): string {
    return typeof message === 'function' ? message() : message
  }
}
