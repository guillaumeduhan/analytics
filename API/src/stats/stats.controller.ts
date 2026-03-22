import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats/:siteId')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d', '12m'] })
  summary(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
  ) {
    return this.statsService.summary(siteId, period);
  }

  @Get('timeseries')
  @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d', '12m'] })
  timeseries(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
  ) {
    return this.statsService.timeseries(siteId, period);
  }

  @Get('pages')
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'limit', required: false })
  topPages(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
    @Query('limit') limit = 10,
  ) {
    return this.statsService.topPages(siteId, period, +limit);
  }

  @Get('referrers')
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'limit', required: false })
  topReferrers(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
    @Query('limit') limit = 10,
  ) {
    return this.statsService.topReferrers(siteId, period, +limit);
  }

  @Get('countries')
  @ApiQuery({ name: 'period', required: false })
  countries(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
  ) {
    return this.statsService.countries(siteId, period);
  }

  @Get('breakdown/:property')
  @ApiQuery({ name: 'period', required: false })
  breakdown(
    @Param('siteId') siteId: string,
    @Param('property') property: 'device' | 'browser' | 'os',
    @Query('period') period = '30d',
  ) {
    return this.statsService.breakdown(siteId, period, property);
  }

  @Get('utm')
  @ApiQuery({ name: 'period', required: false })
  utm(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
  ) {
    return this.statsService.utmCampaigns(siteId, period);
  }

  @Get('events')
  @ApiQuery({ name: 'period', required: false })
  events(
    @Param('siteId') siteId: string,
    @Query('period') period = '30d',
  ) {
    return this.statsService.events(siteId, period);
  }

  @Get('realtime')
  realtime(@Param('siteId') siteId: string) {
    return this.statsService.realtime(siteId);
  }
}
