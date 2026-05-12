import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Param,
  Query,
} from '@nestjs/common'

import { BookQueryService } from '#catalog/application/services/book-query.service.js'
import { BookSortOrder } from '#catalog/application/read-models/index.js'

const VALID_SORTS = new Set<string>(Object.values(BookSortOrder))

@Controller()
export class StorefrontController {
  constructor(private readonly bookQueryService: BookQueryService) {}

  @Get('books')
  async listBooks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @Query('tagId') tagId?: string,
    @Query('sort') sort?: string,
  ) {
    if (sort && !VALID_SORTS.has(sort)) {
      throw new BadRequestException(`Invalid sort value: ${sort}`)
    }
    return this.bookQueryService.listBooks({
      page,
      limit,
      search,
      categoryId,
      authorId,
      tagId,
      sort: sort as BookSortOrder | undefined,
    })
  }

  @Get('books/:slug')
  async getBook(@Param('slug') slug: string) {
    return this.bookQueryService.getBookBySlug(slug)
  }

  @Get('books/:slug/related')
  async getRelatedBooks(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ) {
    return this.bookQueryService.getRelatedBooks(slug, limit)
  }
}
