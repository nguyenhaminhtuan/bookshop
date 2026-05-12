import type { IntegrationEvent } from '#shared/integration-event.js'

export const OUTBOX_REPOSITORY = Symbol('OUTBOX_REPOSITORY')

export interface OutboxRepository {
  save(...messages: IntegrationEvent[]): Promise<void>
}
