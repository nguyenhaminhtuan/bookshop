import { defineEntity, p } from '@mikro-orm/postgresql'

const OutboxEventSchema = defineEntity({
  name: 'OutboxEvent',
  schema: 'outbox',
  tableName: 'events',
  properties: {
    id: p.uuid().primary(),
    aggregateType: p.string(),
    aggregateId: p.uuid(),
    type: p.string(),
    payload: p.json<Record<string, unknown>>(),
    metadata: p.json<Record<string, unknown>>().default('{}'),
    occurredAt: p.datetime(),
  },
})

export class OutboxEvent extends OutboxEventSchema.class {}
OutboxEventSchema.setClass(OutboxEvent)
