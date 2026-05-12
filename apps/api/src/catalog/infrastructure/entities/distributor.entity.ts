import { defineEntity, p } from '@mikro-orm/postgresql'

const DistributorEntitySchema = defineEntity({
  name: 'DistributorEntity',
  schema: 'catalog',
  tableName: 'distributors',
  properties: {
    id: p.uuid().primary(),
    name: p.string(),
    bio: p.string().nullable(),
    image: p.string().nullable(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class DistributorEntity extends DistributorEntitySchema.class {}
DistributorEntitySchema.setClass(DistributorEntity)
