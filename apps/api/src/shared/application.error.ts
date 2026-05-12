export abstract class ApplicationError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(message: string) {
    super(message)
  }
}
