import 'reflect-metadata'
import { Logger as NestLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const logger = new NestLogger(bootstrap.name)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })

  const host = process.env.HOST ?? '0.0.0.0'
  const port = process.env.PORT ?? 8000
  const isLocal = process.env.NODE_ENV === undefined

  const pinoLogger = app.get(Logger)
  app.useLogger(pinoLogger)

  app.enableCors({
    origin: isLocal ? '*' : [],
  })

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(port, host)

  const url = await app.getUrl()
  logger.log(`Application is running on ${url}`)
}

await bootstrap()
