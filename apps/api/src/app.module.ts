import { randomUUID } from 'node:crypto'

import { MikroOrmModule } from '@mikro-orm/nestjs'
import { PostgreSqlDriver, UnderscoreNamingStrategy } from '@mikro-orm/postgresql'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { LoggerModule } from 'nestjs-pino'

import { AuthModule } from '#auth/auth.module.js'
import { CartModule } from '#cart/cart.module.js'
import { CatalogModule } from '#catalog/catalog.module.js'
import { CustomerModule } from '#customer/customer.module.js'
import { InventoryModule } from '#inventory/inventory.module.js'
import { NotificationModule } from '#notification/notification.module.js'
import { OrderModule } from '#order/order.module.js'
import { PaymentModule } from '#payment/payment.module.js'
import { PromotionModule } from '#promotion/promotion.module.js'
import { ReviewModule } from '#review/review.module.js'
import { ShippingModule } from '#shipping/shipping.module.js'

@Module({
  imports: [
    AuthModule,
    CartModule,
    CatalogModule,
    CustomerModule,
    InventoryModule,
    NotificationModule,
    OrderModule,
    PaymentModule,
    PromotionModule,
    ReviewModule,
    ShippingModule,
    CqrsModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: process.env.NODE_ENV === undefined,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: ['*.password', 'req.headers.authorization'],
        quietReqLogger: true,
        quietResLogger: true,
        customAttributeKeys: {
          reqId: 'correlationId',
        },
        customReceivedMessage: () => '',
        customReceivedObject: (req) => ({ method: req.method, url: req.url }),
        customSuccessMessage: () => '',
        customSuccessObject: (req) => ({ method: req.method, url: req.url }),
        customErrorMessage: () => '',
        customErrorObject: (req, res, error, value) => ({
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime: value.responseTime,
          error: {
            message: error.message,
            name: error.name,
          },
        }),
        genReqId: () => randomUUID(),
      },
    }),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      namingStrategy: UnderscoreNamingStrategy,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5432),
      dbName: process.env.DB_DBNAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      debug: process.env.NODE_ENV !== 'production',
      slowQueryThreshold: 300,
      entities:
        process.env.NODE_ENV === 'production'
          ? ['./dist/**/*.entity.js']
          : ['./src/**/*.entity.ts'],
    }),
  ],
})
export class AppModule {}
