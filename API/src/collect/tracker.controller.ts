import { Controller, Get, Res } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { join } from 'path';
import type { Response } from 'express';

@Controller()
export class TrackerController {
  @Public()
  @Get('js/tracker.js')
  serve(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'js', 'tracker.js'));
  }
}
