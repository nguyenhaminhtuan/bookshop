export class CreatePublisherDto {
  name: string
  bio?: string | null
  image?: string | null
}

export class UpdatePublisherDto {
  name: string
  bio: string | null
  image: string | null
}
