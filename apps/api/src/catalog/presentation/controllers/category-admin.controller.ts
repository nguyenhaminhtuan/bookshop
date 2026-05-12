import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type { CreateCategoryDto, UpdateCategoryDto } from '#catalog/application/dtos/index.js'
import { CategoryCommandService } from '#catalog/application/services/index.js'

@Controller('categories')
export class CategoryAdminController {
  constructor(private readonly categoryCommandService: CategoryCommandService) {}

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryCommandService.createCategory(dto)
  }

  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryCommandService.updateCategory(id, dto)
  }
}
