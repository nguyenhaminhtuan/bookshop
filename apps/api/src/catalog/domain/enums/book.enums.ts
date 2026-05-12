import type { ValueOf } from 'type-fest'

export const BookStatus = {
  Draft: 'DRAFT',
  Unpublished: 'UNPUBLISHED',
  Published: 'PUBLISHED',
  Discontinued: 'DISCONTINUED',
} as const

export type BookStatus = ValueOf<typeof BookStatus>
