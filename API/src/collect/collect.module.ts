import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site, Session, Pageview, Event } from '../entities';
import { CollectController } from './collect.controller';
import { CollectService } from './collect.service';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Session, Pageview, Event])],
  controllers: [CollectController],
  providers: [CollectService],
})
export class CollectModule {}
