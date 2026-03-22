import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pageview } from '../entities';

@Injectable()
export class PageviewsService {
  constructor(
    @InjectRepository(Pageview) private repo: Repository<Pageview>,
  ) {}

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

  async findAll(siteId: string, period: string, limit: number, offset: number) {
    const { from, to } = this.dateRange(period);
    const [data, total] = await this.repo.findAndCount({
      where: { site_id: siteId, timestamp: Between(from, to) },
      order: { timestamp: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { data, total, limit, offset };
  }

  async findOne(siteId: string, id: string) {
    const pageview = await this.repo.findOne({
      where: { id, site_id: siteId },
    });
    if (!pageview) throw new NotFoundException('Pageview not found');
    return pageview;
  }
}
