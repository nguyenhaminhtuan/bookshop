import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.info(`Server is running on http://localhost:${info.port.toString()}`)
})
