import { defineEntity, p } from '@mikro-orm/postgresql'

const ProcessedEventSchema = defineEntity({
  name: 'ProcessedEvent',
  schema: 'outbox',
  tableName: 'processed_events',
  properties: {
    eventId: p.uuid().primary(),
    handlerName: p.string().primary(),
    processedAt: p.datetime(),
  },
})

export class ProcessedEvent extends ProcessedEventSchema.class {}
ProcessedEventSchema.setClass(ProcessedEvent)
