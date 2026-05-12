import { Injectable } from '@nestjs/common'
import { createRemoteJWKSet } from 'jose'

@Injectable()
export class JwksService {
  public readonly jwks: ReturnType<typeof createRemoteJWKSet>

  constructor() {
    const authServiceUrl = process.env.AUTH_URL
    const jwksUrl = new URL('/jwks', authServiceUrl)
    this.jwks = createRemoteJWKSet(jwksUrl)
  }
}
