import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type { CreateAuthorDto, UpdateAuthorDto } from '#catalog/application/dtos/index.js'
import { AuthorCommandService } from '#catalog/application/services/index.js'

@Controller('authors')
export class AuthorAdminController {
  constructor(private readonly authorCommandService: AuthorCommandService) {}

  @Post()
  async createAuthor(@Body() dto: CreateAuthorDto) {
    return this.authorCommandService.createAuthor(dto)
  }

  @Patch(':id')
  async updateAuthor(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorCommandService.updateAuthor(id, dto)
  }
}
