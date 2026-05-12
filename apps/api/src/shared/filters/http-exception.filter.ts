import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common'
import type { Request, Response } from 'express'

import { ApplicationError } from '#shared/application.error.js'
import { DomainError } from '#shared/domain/domain-error.js'

export interface ValidationErrorDetail {
  path: string
  message: string
  code: string
}

export interface ErrorResponse {
  error: string
  message: string
  timestamp: string
  correlationId: string | null
  details?: ValidationErrorDetail[]
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request & { id?: string }>()
    const correlationId = request.id ?? null

    const { status, body } = this.toErrorResponse(exception, correlationId)

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        { correlationId, err: exception },
        exception instanceof Error ? exception.message : 'Unhandled exception',
      )
    } else {
      this.logger.debug({ correlationId, status, body }, 'Handled exception')
    }

    response.status(status).json(body)
  }

  private toErrorResponse(
    exception: unknown,
    correlationId: string | null,
  ): { status: number; body: ErrorResponse } {
    const timestamp = new Date().toISOString()

    if (exception instanceof DomainError) {
      return {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        body: {
          error: exception.code,
          message: exception.message,
          timestamp,
          correlationId,
        },
      }
    }

    if (exception instanceof ApplicationError) {
      return {
        status: exception.statusCode,
        body: {
          error: exception.code,
          message: exception.message,
          timestamp,
          correlationId,
        },
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const res = exception.getResponse()
      const details = extractValidationDetails(res)
      return {
        status,
        body: {
          error: resolveHttpErrorCode(res, status),
          message: resolveHttpMessage(res, exception.message),
          timestamp,
          correlationId,
          ...(details ? { details } : {}),
        },
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        timestamp,
        correlationId,
      },
    }
  }
}

function resolveHttpErrorCode(res: string | object, status: number): string {
  if (isRecord(res) && typeof res.error === 'string') {
    return toErrorCode(res.error)
  }
  return toErrorCode(HttpStatus[status] ?? 'HTTP_ERROR')
}

function resolveHttpMessage(res: string | object, fallback: string): string {
  if (typeof res === 'string') return res
  if (isRecord(res)) {
    const message = res.message
    if (typeof message === 'string') return message
    if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'string') {
      return message[0]
    }
  }
  return fallback
}

function extractValidationDetails(res: string | object): ValidationErrorDetail[] | undefined {
  if (!isRecord(res)) return undefined
  const message = res.message
  if (!Array.isArray(message)) return undefined

  const details: ValidationErrorDetail[] = []
  for (const item of message) {
    if (typeof item === 'string') {
      details.push({ path: '', message: item, code: 'VALIDATION_ERROR' })
    } else if (isRecord(item)) {
      const path = typeof item.path === 'string' ? item.path : ''
      const msg = typeof item.message === 'string' ? item.message : String(item.message ?? '')
      const code = typeof item.code === 'string' ? item.code : 'VALIDATION_ERROR'
      details.push({ path, message: msg, code })
    }
  }
  return details.length > 0 ? details : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toErrorCode(value: string): string {
  return value.replace(/\s+/g, '_').toUpperCase()
}
