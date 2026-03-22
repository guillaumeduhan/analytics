import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Site } from './site.entity';
import { Pageview } from './pageview.entity';
import { Event } from './event.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  site_id: string;

  @Column({ type: 'text' })
  visitor_id: string;

  @Column({ type: 'text', nullable: true })
  country: string | null;

  @Column({ type: 'text', nullable: true })
  city: string | null;

  @Column({ type: 'text', nullable: true })
  device: string | null;

  @Column({ type: 'text', nullable: true })
  browser: string | null;

  @Column({ type: 'text', nullable: true })
  os: string | null;

  @Column({ type: 'text', nullable: true })
  referrer: string | null;

  @Column({ type: 'text', nullable: true })
  utm_source: string | null;

  @Column({ type: 'text', nullable: true })
  utm_medium: string | null;

  @Column({ type: 'text', nullable: true })
  utm_campaign: string | null;

  @Column({ type: 'integer', default: 0 })
  duration: number;

  @Column({ type: 'integer', default: 0 })
  pageview_count: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  started_at: Date;

  @ManyToOne(() => Site, (s) => s.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @OneToMany(() => Pageview, (p) => p.session)
  pageviews: Pageview[];

  @OneToMany(() => Event, (e) => e.session)
  events: Event[];
}
