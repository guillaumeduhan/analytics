import {
  Controller,
  Post,
  Body,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { CollectService } from './collect.service';
import {
  CollectPageviewDto,
  CollectEventDto,
  UpdateDurationDto,
} from './collect.dto';

@Public()
@ApiTags('collect')
@Controller('collect')
export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  private verifyOrigin(req: Request, domain: string) {
    const origin = req.headers['origin'] || req.headers['referer'] || '';
    try {
      const hostname = new URL(origin as string).hostname;
      if (hostname !== domain && !hostname.endsWith('.' + domain)) {
        throw new ForbiddenException('Origin mismatch');
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      throw new ForbiddenException('Missing or invalid origin');
    }
  }

  @Post('pageview')
  pageview(@Req() req: Request, @Body() dto: CollectPageviewDto) {
    this.verifyOrigin(req, dto.domain);
    return this.collectService.pageview(dto);
  }

  @Post('event')
  event(@Req() req: Request, @Body() dto: CollectEventDto) {
    this.verifyOrigin(req, dto.domain);
    return this.collectService.event(dto);
  }

  @Post('duration')
  duration(@Body() dto: UpdateDurationDto) {
    return this.collectService.updateDuration(dto);
  }
}
