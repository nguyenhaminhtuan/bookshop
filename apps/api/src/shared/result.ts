export type Result<TValue, TError> = Ok<TValue> | Err<TError>

export type Ok<TValue> = { type: 'ok'; value: TValue }

export type Err<TError> = { type: 'err'; error: TError }

export function ok<TValue>(value: TValue): Ok<TValue> {
  return { type: 'ok', value }
}

export function err<TError>(error: TError): Err<TError> {
  return { type: 'err', error }
}

export function isOk<TValue, TError>(result: Result<TValue, TError>): result is Ok<TValue> {
  return result.type === 'ok'
}

export function isErr<TValue, TError>(result: Result<TValue, TError>): result is Err<TError> {
  return result.type === 'err'
}
