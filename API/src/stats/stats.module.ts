import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site, Session, Pageview, Event } from '../entities';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Session, Pageview, Event])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
