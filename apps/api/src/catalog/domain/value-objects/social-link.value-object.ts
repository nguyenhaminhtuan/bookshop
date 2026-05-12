import type { ValueOf } from 'type-fest'

import { DomainInvariantError } from '#shared/domain/domain-invariant.error.js'
import { ValueObject } from '#shared/domain/value-object.js'

export const SocialPlatform = {
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  LinkedIn: 'LinkedIn',
  TikTok: 'TikTok',
  Twitter: 'Twitter',
  Website: 'Website',
  YouTube: 'YouTube',
} as const

export type SocialPlatform = ValueOf<typeof SocialPlatform>

type SocialLinkProps = {
  platform: SocialPlatform
  url: string
}

const SOCIAL_PLATFORMS = new Set<string>(Object.values(SocialPlatform))

export class SocialLink extends ValueObject<SocialLinkProps> {
  private constructor(props: SocialLinkProps) {
    super(props)
  }

  static create(props: SocialLinkProps): SocialLink {
    const url = props.url.trim()

    if (!SOCIAL_PLATFORMS.has(props.platform)) {
      throw new DomainInvariantError('Social platform is invalid')
    }

    if (!isValidUrl(url)) {
      throw new DomainInvariantError('Social link URL is invalid')
    }

    return new SocialLink({
      platform: props.platform,
      url,
    })
  }

  get platform(): SocialPlatform {
    return this.props.platform
  }

  get url(): string {
    return this.props.url
  }
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
