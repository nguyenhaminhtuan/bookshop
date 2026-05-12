import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type {
  BookTagsDto,
  ChangeBookPriceDto,
  CreateBookDto,
  RenameBookDto,
  UpdateBookInfoDto,
} from '#catalog/application/dtos/index.js'
import { BookCommandService } from '#catalog/application/services/index.js'

@Controller('books')
export class BookAdminController {
  constructor(private readonly bookCommandService: BookCommandService) {}

  @Post()
  async createBook(@Body() dto: CreateBookDto) {
    return this.bookCommandService.createBook(dto)
  }

  @Patch(':id')
  async updateBookInfo(@Param('id') id: string, @Body() dto: UpdateBookInfoDto) {
    return this.bookCommandService.updateBookInfo(id, dto)
  }

  @Post(':id\\:rename')
  async renameBook(@Param('id') id: string, @Body() dto: RenameBookDto) {
    return this.bookCommandService.renameBook(id, dto)
  }

  @Post(':id\\:change-price')
  async changeBookPrice(@Param('id') id: string, @Body() dto: ChangeBookPriceDto) {
    return this.bookCommandService.changeBookPrice(id, dto)
  }

  @Post(':id\\:add-tags')
  async addTags(@Param('id') id: string, @Body() dto: BookTagsDto) {
    return this.bookCommandService.addTagsToBook(id, dto)
  }

  @Post(':id\\:remove-tags')
  async removeTags(@Param('id') id: string, @Body() dto: BookTagsDto) {
    return this.bookCommandService.removeTagsFromBook(id, dto)
  }

  @Post(':id\\:publish')
  async publishBook(@Param('id') id: string) {
    return this.bookCommandService.publishBook(id)
  }

  @Post(':id\\:discontinue')
  async discontinue(@Param('id') id: string) {
    return this.bookCommandService.discontinue(id)
  }
}
