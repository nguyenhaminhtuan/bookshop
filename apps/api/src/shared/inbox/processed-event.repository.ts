export const PROCESSED_EVENT_REPOSITORY = Symbol('PROCESSED_EVENT_REPOSITORY')

export interface ProcessedEventRepository {
  isProcessed(eventId: string, handlerName: string): Promise<boolean>
  markProcessed(eventId: string, handlerName: string): Promise<void>
}
