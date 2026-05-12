import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

import type { SeriesId } from './series-id.value-object.js'

type SeriesInfoProps = {
  seriesId: SeriesId
  partNumber: number
}

export class SeriesInfo extends ValueObject<SeriesInfoProps> {
  private constructor(props: SeriesInfoProps) {
    super(props)
  }

  static create(props: SeriesInfoProps): SeriesInfo {
    Guard.againstNegative(props.partNumber, 'Series part')
    return new SeriesInfo(props)
  }

  get seriesId(): SeriesId {
    return this.props.seriesId
  }

  get partNumber(): number {
    return this.props.partNumber
  }
}
