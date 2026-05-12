export class CreateDistributorDto {
  name: string
  bio?: string | null
  image?: string | null
}

export class UpdateDistributorDto {
  name: string
  bio: string | null
  image: string | null
}
