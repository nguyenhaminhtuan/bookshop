export class CreateBookDto {
  isbn: string
  title: string
  description: string
  price: {
    amount: number
    currency: string
  }
  dimension: {
    width: number
    height: number
    thickness: number
    unit: string
  }
  releaseDate: string
  pageCount: number | null
  coverMaterial: string | null
  images: {
    url: string
  }[]
  authorIds: string[]
  categoryId: string
  tagIds: string[]
  publisherId: string
  distributorId: string
}
