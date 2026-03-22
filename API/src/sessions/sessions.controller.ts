import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@Controller('sites/:siteId/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

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
    return this.sessionsService.findAll(siteId, period, +limit, +offset);
  }

  @Get(':id')
  findOne(@Param('siteId') siteId: string, @Param('id') id: string) {
    return this.sessionsService.findOne(siteId, id);
  }
}
