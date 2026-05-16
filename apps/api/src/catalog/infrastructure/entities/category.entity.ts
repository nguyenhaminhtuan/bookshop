import { defineEntity, p } from '@mikro-orm/postgresql'

const CategoryEntitySchema = defineEntity({
  name: 'CategoryEntity',
  schema: 'catalog',
  tableName: 'categories',
  properties: {
    id: p.uuid().primary(),
    name: p.string(),
    slug: p.string(),
    description: p.string().nullable(),
    image: p.string().nullable(),
    displayOrder: p.smallint(),
    parent: () => p.manyToOne(CategoryEntity).nullable(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class CategoryEntity extends CategoryEntitySchema.class {}
CategoryEntitySchema.setClass(CategoryEntity)
