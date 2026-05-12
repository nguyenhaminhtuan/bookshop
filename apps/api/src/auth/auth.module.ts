import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { JwksService } from './jwks.service.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'

@Module({
  providers: [
    JwksService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwksService],
})
export class AuthModule {}
