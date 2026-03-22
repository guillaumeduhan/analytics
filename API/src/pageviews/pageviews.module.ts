import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pageview } from '../entities';
import { PageviewsController } from './pageviews.controller';
import { PageviewsService } from './pageviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pageview])],
  controllers: [PageviewsController],
  providers: [PageviewsService],
})
export class PageviewsModule {}
