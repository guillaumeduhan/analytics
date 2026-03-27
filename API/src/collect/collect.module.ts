import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site, Session, Pageview, Event } from '../entities';
import { CollectController } from './collect.controller';
import { TrackerController } from './tracker.controller';
import { CollectService } from './collect.service';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Session, Pageview, Event])],
  controllers: [CollectController, TrackerController],
  providers: [CollectService],
})
export class CollectModule {}
