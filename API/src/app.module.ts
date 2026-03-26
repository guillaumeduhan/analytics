import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { Site, Session, Pageview, Event } from './entities';
import { CollectModule } from './collect/collect.module';
import { StatsModule } from './stats/stats.module';
import { SitesModule } from './sites/sites.module';
import { HealthModule } from './health/health.module';
import { SessionsModule } from './sessions/sessions.module';
import { PageviewsModule } from './pageviews/pageviews.module';
import { EventsModule } from './events/events.module';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DATABASE_HOST'),
        port: cfg.get<number>('DATABASE_PORT'),
        username: cfg.get('DATABASE_USER'),
        password: cfg.get('DATABASE_PASSWORD'),
        database: cfg.get('DATABASE_NAME'),
        entities: [Site, Session, Pageview, Event],
        synchronize: false,
      }),
    }),
    CollectModule,
    StatsModule,
    SitesModule,
    SessionsModule,
    PageviewsModule,
    EventsModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
  ],
})
export class AppModule {}
