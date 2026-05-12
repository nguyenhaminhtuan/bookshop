import { defineEntity, p } from '@mikro-orm/postgresql'

const TagEntitySchema = defineEntity({
  name: 'TagEntity',
  schema: 'catalog',
  tableName: 'tags',
  properties: {
    id: p.uuid().primary(),
    name: p.string(),
    slug: p.string(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class TagEntity extends TagEntitySchema.class {}
TagEntitySchema.setClass(TagEntity)
