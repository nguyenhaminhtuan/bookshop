import { Body, Controller, Param, Patch, Post } from '@nestjs/common'

import type { CreateDistributorDto, UpdateDistributorDto } from '#catalog/application/dtos/index.js'
import { DistributorCommandService } from '#catalog/application/services/index.js'

@Controller('distributors')
export class DistributorAdminController {
  constructor(private readonly distributorCommandService: DistributorCommandService) {}

  @Post()
  async createDistributor(@Body() dto: CreateDistributorDto) {
    return this.distributorCommandService.createDistributor(dto)
  }

  @Patch(':id')
  async updateDistributor(@Param('id') id: string, @Body() dto: UpdateDistributorDto) {
    return this.distributorCommandService.updateDistributor(id, dto)
  }
}
