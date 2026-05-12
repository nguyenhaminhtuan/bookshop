import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type { CreateTagDto, UpdateTagDto } from '#catalog/application/dtos/index.js'
import { TagCommandService } from '#catalog/application/services/index.js'

@Controller('tags')
export class TagAdminController {
  constructor(private readonly tagCommandService: TagCommandService) {}

  @Post()
  async createTag(@Body() dto: CreateTagDto) {
    return this.tagCommandService.createTag(dto)
  }

  @Patch(':id')
  async updateTag(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagCommandService.updateTag(id, dto)
  }
}
