import { Guard } from '#shared/domain/guard.js'
import { ValueObject } from '#shared/domain/value-object.js'

export type DimensionProps = {
  width: number
  height: number
  thickness: number
  unit: string
}

export class Dimension extends ValueObject<DimensionProps> {
  private constructor(props: DimensionProps) {
    super(props)
  }

  static create(props: DimensionProps): Dimension {
    Guard.againstZeroOrNegative(props.width, 'Dimension width')
    Guard.againstZeroOrNegative(props.height, 'Dimension height')
    Guard.againstZeroOrNegative(props.thickness, 'Dimension thickness')
    Guard.againstEmptyString(props.unit, 'Dimension unit')
    return new Dimension(props)
  }

  static from(props: DimensionProps): Dimension {
    return Dimension.create(props)
  }

  toPrimitives(): DimensionProps {
    return {
      width: this.props.width,
      height: this.props.height,
      thickness: this.props.thickness,
      unit: this.props.unit,
    }
  }

  get width() {
    return this.props.width
  }

  get height() {
    return this.props.height
  }

  get thickness() {
    return this.props.thickness
  }

  get unit() {
    return this.props.unit
  }
}
