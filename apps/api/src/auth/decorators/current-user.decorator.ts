import type { ExecutionContext } from '@nestjs/common'
import type { JWTPayload } from 'jose'
import { createParamDecorator, UnauthorizedException } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: keyof JWTPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JWTPayload }>()
    return data ? request.user[data] : request.user
  },
)

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user: JWTPayload }>()
    const sub = request.user.sub
    if (!sub) throw new UnauthorizedException('JWT missing subject claim')
    return sub
  },
)
