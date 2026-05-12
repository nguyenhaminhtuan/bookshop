import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { JWTPayload } from 'jose'
import { jwtVerify } from 'jose'

import { IS_PUBLIC_KEY } from './auth.constants.js'
import { JwksService } from './jwks.service.js'

interface AuthRequest {
  headers: { authorization?: string }
  user?: JWTPayload
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly _logger = new Logger(JwtAuthGuard.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly jwksService: JwksService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<AuthRequest>()
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header')
    }

    const token = authHeader.slice(7)
    const authServiceUrl = process.env.AUTH_URL

    try {
      const { payload } = await jwtVerify(token, this.jwksService.jwks, {
        issuer: authServiceUrl,
        audience: authServiceUrl,
      })

      if (!payload.sub) {
        throw new UnauthorizedException('JWT missing subject claim')
      }

      request.user = payload
      return true
    } catch (error) {
      this._logger.debug('Verify token failed', { error })
      if (error instanceof UnauthorizedException) throw error
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
