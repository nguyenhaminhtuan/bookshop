import { defineEntity, p } from '@mikro-orm/postgresql'

const PublisherEntitySchema = defineEntity({
  name: 'PublisherEntity',
  schema: 'catalog',
  tableName: 'publishers',
  properties: {
    id: p.uuid().primary(),
    name: p.string(),
    bio: p.string().nullable(),
    image: p.string().nullable(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class PublisherEntity extends PublisherEntitySchema.class {}
PublisherEntitySchema.setClass(PublisherEntity)
