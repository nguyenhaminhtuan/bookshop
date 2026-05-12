export class SocialLinkDto {
  platform: string
  url: string
}

export class CreateAuthorDto {
  name: string
  bio?: string | null
  image?: string | null
  socialLinks?: SocialLinkDto[]
}

export class UpdateAuthorDto {
  name: string
  bio: string | null
  image: string | null
  socialLinks: SocialLinkDto[]
}
