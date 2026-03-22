import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectService } from './collect.service';
import {
  CollectPageviewDto,
  CollectEventDto,
  UpdateDurationDto,
} from './collect.dto';

@ApiTags('collect')
@Controller('collect')
export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  @Post('pageview')
  pageview(@Body() dto: CollectPageviewDto) {
    return this.collectService.pageview(dto);
  }

  @Post('event')
  event(@Body() dto: CollectEventDto) {
    return this.collectService.event(dto);
  }

  @Post('duration')
  duration(@Body() dto: UpdateDurationDto) {
    return this.collectService.updateDuration(dto);
  }
}
