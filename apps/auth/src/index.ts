import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './lib/auth.js'
import { logger } from './lib/logger.js'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: ['*'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
)

app.on(['POST', 'GET'], '*', (c) => auth.handler(c.req.raw))

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 4000) }, (info) => {
  logger.info(`Server is running on http://localhost:${info.port.toString()}`)
})
