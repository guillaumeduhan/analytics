import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site, Session, Pageview, Event } from '../entities';
import {
  CollectPageviewDto,
  CollectEventDto,
  UpdateDurationDto,
} from './collect.dto';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Site) private siteRepo: Repository<Site>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Pageview) private pageviewRepo: Repository<Pageview>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
  ) {}

  async pageview(dto: CollectPageviewDto) {
    const site = await this.siteRepo.findOne({
      where: { domain: dto.domain },
    });
    if (!site) throw new NotFoundException('Site not found');

    let session: Session;

    if (dto.session_id) {
      // Existing session — increment pageview count
      const found = await this.sessionRepo.findOne({
        where: { id: dto.session_id },
      });
      if (!found) throw new NotFoundException('Session not found');
      session = found;
      session.pageview_count += 1;
      await this.sessionRepo.save(session);
    } else {
      // New session
      session = this.sessionRepo.create({
        site_id: site.id,
        visitor_id: dto.visitor_id,
        country: dto.country,
        city: dto.city,
        device: dto.device,
        browser: dto.browser,
        os: dto.os,
        referrer: dto.referrer,
        utm_source: dto.utm_source,
        utm_medium: dto.utm_medium,
        utm_campaign: dto.utm_campaign,
        pageview_count: 1,
      });
      session = await this.sessionRepo.save(session);
    }

    const pv = this.pageviewRepo.create({
      site_id: site.id,
      session_id: session.id,
      visitor_id: dto.visitor_id,
      pathname: dto.pathname,
      referrer: dto.referrer,
    });
    const saved = await this.pageviewRepo.save(pv);

    return { session_id: session.id, pageview_id: saved.id };
  }

  async event(dto: CollectEventDto) {
    const site = await this.siteRepo.findOne({
      where: { domain: dto.domain },
    });
    if (!site) throw new NotFoundException('Site not found');

    const ev = this.eventRepo.create({
      site_id: site.id,
      session_id: dto.session_id,
      visitor_id: dto.visitor_id,
      name: dto.name,
      props: dto.props,
    });
    return this.eventRepo.save(ev);
  }

  async updateDuration(dto: UpdateDurationDto) {
    // Update session duration
    await this.sessionRepo.update(dto.session_id, { duration: dto.duration });
    // Update pageview duration
    await this.pageviewRepo.update(dto.pageview_id, {
      duration: dto.duration,
    });
    return { ok: true };
  }
}
