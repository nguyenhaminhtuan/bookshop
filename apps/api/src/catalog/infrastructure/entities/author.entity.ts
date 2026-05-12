import { defineEntity, p } from '@mikro-orm/postgresql'

const AuthorEntitySchema = defineEntity({
  name: 'AuthorEntity',
  schema: 'catalog',
  tableName: 'authors',
  properties: {
    id: p.uuid().primary(),
    slug: p.string(),
    name: p.string(),
    bio: p.string().nullable(),
    image: p.string().nullable(),
    socialLinks: p.json<Record<string, string>>(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
  },
})

export class AuthorEntity extends AuthorEntitySchema.class {}
AuthorEntitySchema.setClass(AuthorEntity)
