import type { OutboxMessage } from './outbox-message.js'

export const OUTBOX_REPOSITORY = Symbol('OUTBOX_REPOSITORY')

export interface OutboxRepository {
  save(messages: OutboxMessage[]): Promise<void>
}
