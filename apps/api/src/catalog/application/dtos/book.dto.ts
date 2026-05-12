export class RenameBookDto {
  title: string
}

export class ChangeBookPriceDto {
  price: {
    amount: number
    currency: string
  }
}

export class UpdateBookInfoDto {
  isbn: string
  description: string
  dimension: {
    width: number
    height: number
    thickness: number
    unit: string
  }
  releaseDate: string
  pageCount: number | null
  coverMaterial: string | null
}

export class BookTagsDto {
  tagIds: string[]
}
