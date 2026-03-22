import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session } from '../entities';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private repo: Repository<Session>,
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
      where: { site_id: siteId, started_at: Between(from, to) },
      order: { started_at: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { data, total, limit, offset };
  }

  async findOne(siteId: string, id: string) {
    const session = await this.repo.findOne({
      where: { id, site_id: siteId },
      relations: ['pageviews', 'events'],
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }
}
