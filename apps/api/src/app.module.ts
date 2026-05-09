import { MikroOrmModule } from '@mikro-orm/nestjs'
import { PostgreSqlDriver, UnderscoreNamingStrategy } from '@mikro-orm/postgresql'
import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'

import { AuthModule } from '#auth/auth.module.js'
import { CartModule } from '#cart/cart.module.js'
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
    CustomerModule,
    InventoryModule,
    NotificationModule,
    OrderModule,
    PaymentModule,
    PromotionModule,
    ReviewModule,
    ShippingModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: process.env.NODE_ENV === undefined,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: ['*.password', 'req.headers.authorization'],
      },
    }),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      namingStrategy: UnderscoreNamingStrategy,
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5432),
      dbName: process.env.DB_DBNAME ?? 'bookshop',
      user: process.env.DB_PASSWORD,
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
