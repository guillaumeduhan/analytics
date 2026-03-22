import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../entities';
import { CreateSiteDto } from './sites.dto';

@Injectable()
export class SitesService {
  constructor(@InjectRepository(Site) private repo: Repository<Site>) {}

  findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }

  create(dto: CreateSiteDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
