import { defineEntity, p } from '@mikro-orm/postgresql'

const OutboxEventSchema = defineEntity({
  name: 'OutboxEvent',
  properties: {
    id: p.uuid().primary(),
    aggregateType: p.string(),
    aggregateId: p.uuid(),
    type: p.string(),
    payload: p.json<Record<string, unknown>>(),
    metadata: p.json<Record<string, unknown>>(),
    createdAt: p.datetime(),
  },
})

export class OutboxEvent extends OutboxEventSchema.class {}
OutboxEventSchema.setClass(OutboxEvent)
