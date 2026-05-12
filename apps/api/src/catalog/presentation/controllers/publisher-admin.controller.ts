import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type { CreatePublisherDto, UpdatePublisherDto } from '#catalog/application/dtos/index.js'
import { PublisherCommandService } from '#catalog/application/services/index.js'

@Controller('publishers')
export class PublisherAdminController {
  constructor(private readonly publisherCommandService: PublisherCommandService) {}

  @Post()
  async createPublisher(@Body() dto: CreatePublisherDto) {
    return this.publisherCommandService.createPublisher(dto)
  }

  @Patch(':id')
  async updatePublisher(@Param('id') id: string, @Body() dto: UpdatePublisherDto) {
    return this.publisherCommandService.updatePublisher(id, dto)
  }
}
