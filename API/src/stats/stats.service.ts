import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Site, Session, Pageview, Event } from '../entities';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Site) private siteRepo: Repository<Site>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Pageview) private pageviewRepo: Repository<Pageview>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
  ) {}

  private async getSite(siteId: string) {
    const site = await this.siteRepo.findOneBy({ id: siteId });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  private dateRange(period: string): { from: Date; to: Date } {
    const to = new Date();
    const from = new Date();
    switch (period) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        break;
      case '7d':
        from.setDate(from.getDate() - 7);
        break;
      case '30d':
        from.setDate(from.getDate() - 30);
        break;
      case '12m':
        from.setMonth(from.getMonth() - 12);
        break;
      default:
        from.setDate(from.getDate() - 30);
    }
    return { from, to };
  }

  /** Summary: total visitors, pageviews, sessions, avg duration, bounce rate */
  async summary(siteId: string, period: string) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    const [pageviews, sessions, visitors, avgDuration, bounced] =
      await Promise.all([
        this.pageviewRepo.count({
          where: { site_id: siteId, timestamp: Between(from, to) },
        }),
        this.sessionRepo.count({
          where: { site_id: siteId, started_at: Between(from, to) },
        }),
        this.sessionRepo
          .createQueryBuilder('s')
          .select('COUNT(DISTINCT s.visitor_id)', 'count')
          .where('s.site_id = :siteId', { siteId })
          .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
          .getRawOne(),
        this.sessionRepo
          .createQueryBuilder('s')
          .select('COALESCE(AVG(s.duration), 0)', 'avg')
          .where('s.site_id = :siteId', { siteId })
          .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
          .getRawOne(),
        this.sessionRepo.count({
          where: {
            site_id: siteId,
            started_at: Between(from, to),
            pageview_count: 1,
          },
        }),
      ]);

    return {
      visitors: Number(visitors?.count ?? 0),
      pageviews,
      sessions,
      avg_duration: Math.round(Number(avgDuration?.avg ?? 0)),
      bounce_rate: sessions > 0 ? Math.round((bounced / sessions) * 100) : 0,
    };
  }

  /** Timeseries: pageviews & visitors per day/hour */
  async timeseries(siteId: string, period: string) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);
    const trunc = period === 'today' ? 'hour' : 'day';

    const rows = await this.pageviewRepo
      .createQueryBuilder('p')
      .select(`date_trunc('${trunc}', p.timestamp)`, 'date')
      .addSelect('COUNT(*)', 'pageviews')
      .addSelect('COUNT(DISTINCT p.visitor_id)', 'visitors')
      .addSelect('COUNT(DISTINCT p.session_id)', 'visits')
      .where('p.site_id = :siteId', { siteId })
      .andWhere('p.timestamp BETWEEN :from AND :to', { from, to })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return rows.map((r) => ({
      date: r.date,
      pageviews: Number(r.pageviews),
      visitors: Number(r.visitors),
      visits: Number(r.visits),
    }));
  }

  /** Top pages */
  async topPages(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.pageviewRepo
      .createQueryBuilder('p')
      .select('p.pathname', 'pathname')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT p.visitor_id)', 'visitors')
      .where('p.site_id = :siteId', { siteId })
      .andWhere('p.timestamp BETWEEN :from AND :to', { from, to })
      .groupBy('p.pathname')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Top referrers */
  async topReferrers(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.sessionRepo
      .createQueryBuilder('s')
      .select('s.referrer', 'referrer')
      .addSelect('COUNT(*)', 'sessions')
      .where('s.site_id = :siteId', { siteId })
      .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
      .andWhere('s.referrer IS NOT NULL')
      .groupBy('s.referrer')
      .orderBy('sessions', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Entry pages (first page of each session) */
  async entryPages(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    try {
      return await this.pageviewRepo.query(
        `SELECT pathname, COUNT(*)::int AS visitors
         FROM (
           SELECT DISTINCT ON (session_id) session_id, pathname
           FROM pageviews
           WHERE site_id = $1 AND timestamp BETWEEN $2 AND $3
           ORDER BY session_id, timestamp ASC
         ) t
         GROUP BY pathname
         ORDER BY visitors DESC
         LIMIT $4`,
        [siteId, from, to, limit],
      );
    } catch (err) {
      console.error('[entryPages] SQL error:', err);
      throw err;
    }
  }

  /** Exit pages (last page of each session) */
  async exitPages(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    try {
      return await this.pageviewRepo.query(
        `SELECT pathname, COUNT(*)::int AS visitors
         FROM (
           SELECT DISTINCT ON (session_id) session_id, pathname
           FROM pageviews
           WHERE site_id = $1 AND timestamp BETWEEN $2 AND $3
           ORDER BY session_id, timestamp DESC
         ) t
         GROUP BY pathname
         ORDER BY visitors DESC
         LIMIT $4`,
        [siteId, from, to, limit],
      );
    } catch (err) {
      console.error('[exitPages] SQL error:', err);
      throw err;
    }
  }

  /** Breakdown by country */
  async countries(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.sessionRepo
      .createQueryBuilder('s')
      .select('s.country', 'country')
      .addSelect('COUNT(*)', 'sessions')
      .addSelect('COUNT(DISTINCT s.visitor_id)', 'visitors')
      .where('s.site_id = :siteId', { siteId })
      .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
      .andWhere('s.country IS NOT NULL')
      .groupBy('s.country')
      .orderBy('sessions', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Breakdown by city */
  async cities(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.sessionRepo
      .createQueryBuilder('s')
      .select('s.city', 'city')
      .addSelect('COUNT(*)', 'sessions')
      .addSelect('COUNT(DISTINCT s.visitor_id)', 'visitors')
      .where('s.site_id = :siteId', { siteId })
      .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
      .andWhere('s.city IS NOT NULL')
      .groupBy('s.city')
      .orderBy('sessions', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Breakdown by device/browser/os */
  async breakdown(
    siteId: string,
    period: string,
    property: 'device' | 'browser' | 'os',
    limit = 10,
  ) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.sessionRepo
      .createQueryBuilder('s')
      .select(`s.${property}`, property)
      .addSelect('COUNT(*)', 'sessions')
      .where('s.site_id = :siteId', { siteId })
      .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
      .andWhere(`s.${property} IS NOT NULL`)
      .groupBy(`s.${property}`)
      .orderBy('sessions', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** UTM campaigns */
  async utmCampaigns(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.sessionRepo
      .createQueryBuilder('s')
      .select('s.utm_source', 'source')
      .addSelect('s.utm_medium', 'medium')
      .addSelect('s.utm_campaign', 'campaign')
      .addSelect('COUNT(*)', 'sessions')
      .where('s.site_id = :siteId', { siteId })
      .andWhere('s.started_at BETWEEN :from AND :to', { from, to })
      .andWhere('s.utm_source IS NOT NULL')
      .groupBy('s.utm_source')
      .addGroupBy('s.utm_medium')
      .addGroupBy('s.utm_campaign')
      .orderBy('sessions', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Custom events */
  async events(siteId: string, period: string, limit = 10) {
    await this.getSite(siteId);
    const { from, to } = this.dateRange(period);

    return this.eventRepo
      .createQueryBuilder('e')
      .select('e.name', 'name')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COUNT(DISTINCT e.visitor_id)', 'visitors')
      .where('e.site_id = :siteId', { siteId })
      .andWhere('e.timestamp BETWEEN :from AND :to', { from, to })
      .groupBy('e.name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  /** Realtime: active visitors in last 5 minutes */
  async realtime(siteId: string) {
    await this.getSite(siteId);
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await this.pageviewRepo
      .createQueryBuilder('p')
      .select('COUNT(DISTINCT p.visitor_id)', 'active')
      .where('p.site_id = :siteId', { siteId })
      .andWhere('p.timestamp >= :fiveMinAgo', { fiveMinAgo })
      .getRawOne();

    return { active_visitors: Number(result?.active ?? 0) };
  }
}
