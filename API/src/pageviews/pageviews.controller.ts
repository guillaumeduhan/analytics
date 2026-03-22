import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PageviewsService } from './pageviews.service';

@ApiTags('pageviews')
@Controller('sites/:siteId/pageviews')
export class PageviewsController {
  constructor(private readonly pageviewsService: PageviewsService) {}

  @Get()
  @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d', '12m'] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findAll(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.pageviewsService.findAll(siteId, period, +limit, +offset);
  }

  @Get(':id')
  findOne(@Param('siteId') siteId: string, @Param('id') id: string) {
    return this.pageviewsService.findOne(siteId, id);
  }
}
