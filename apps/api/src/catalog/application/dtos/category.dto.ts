export class CreateCategoryDto {
  name: string
  description?: string | null
  image?: string | null
  displayOrder?: number
  parentId?: string | null
}

export class UpdateCategoryDto {
  name: string
  description: string | null
  image: string | null
  displayOrder: number
}
