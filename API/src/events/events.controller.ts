import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('sites/:siteId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d', '12m'] })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by event name' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findAll(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
    @Query('name') name?: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ) {
    return this.eventsService.findAll(siteId, period, +limit, +offset, name);
  }

  @Get(':id')
  findOne(@Param('siteId') siteId: string, @Param('id') id: string) {
    return this.eventsService.findOne(siteId, id);
  }
}
