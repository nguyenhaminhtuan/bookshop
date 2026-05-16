import { randomUUID } from 'node:crypto'

import { redisStorage } from '@better-auth/redis-storage'
import { betterAuth } from 'better-auth'
import { bearer, jwt, openAPI, twoFactor } from 'better-auth/plugins'
import { Redis } from 'ioredis'
import { Pool } from 'pg'

import { logger } from './logger.js'

export const auth = betterAuth({
  appName: process.env.APP_NAME,
  baseURL: process.env.AUTH_URL,
  basePath: '/',
  secret: process.env.AUTH_SECRET,
  trustedOrigins: ['*'],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 30 * 60,
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [
    openAPI({
      path: '/docs',
    }),
    bearer(),
    jwt({
      schema: {
        jwks: {
          fields: {
            publicKey: 'public_key',
            privateKey: 'private_key',
            createdAt: 'created_at',
            expiresAt: 'expires_at',
          },
        },
      },
    }),
    // username({
    //   schema: {
    //     user: {
    //       fields: {
    //         username: 'username',
    //         displayUsername: 'display_username',
    //       },
    //     },
    //   },
    // }),
    twoFactor({
      schema: {
        twoFactor: {
          modelName: 'user_two_factors',
          fields: {
            userId: 'user_id',
            secret: 'secret',
            backupCodes: 'backup_codes',
            twoFactorEnabled: 'two_factor_enabled',
          },
        },
        user: {
          modelName: 'users',
          fields: {
            twoFactorEnabled: 'two_factor_enabled',
          },
        },
      },
    }),
  ],
  database: new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    options: '-c search_path=auth',
  }),
  secondaryStorage: redisStorage({
    client: new Redis(),
    keyPrefix: 'auth:',
  }),
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
    crossSubDomainCookies: {
      enabled: true,
      // domain: '.domain',
    },
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitioned: true,
    },
  },
  user: {
    modelName: 'users',
    fields: {
      name: 'name',
      email: 'email',
      emailVerified: 'email_verified',
      image: 'image',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      twoFactorEnabled: 'two_factor_enabled',
    },
  },
  account: {
    modelName: 'accounts',
    fields: {
      userId: 'user_id',
      accountId: 'account_id',
      providerId: 'provider_id',
      idToken: 'id_token',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      scope: 'scope',
      password: 'password',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    storeStateStrategy: 'cookie',
    storeAccountCookie: true,
  },
  verification: {
    modelName: 'user_verifications',
    fields: {
      identifier: 'identifier',
      value: 'value',
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  session: {
    modelName: 'user_sessions',
    fields: {
      userId: 'user_id',
      token: 'token',
      expiresAt: 'expires_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    storeSessionInDatabase: false,
    preserveSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: 'jwe',
      refreshCache: false,
    },
  },
  logger: {
    disabled: false,
    level: 'info',
    log: (level, message, ...args) => {
      logger[level]({ metadata: args }, message)
    },
  },
})
