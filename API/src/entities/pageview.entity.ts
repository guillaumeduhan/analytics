import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Site } from './site.entity';
import { Session } from './session.entity';

@Entity('pageviews')
export class Pageview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  site_id: string;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'text' })
  visitor_id: string;

  @Column({ type: 'text' })
  pathname: string;

  @Column({ type: 'text', nullable: true })
  referrer: string | null;

  @Column({ type: 'integer', default: 0 })
  duration: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  timestamp: Date;

  @ManyToOne(() => Site, (s) => s.pageviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => Session, (s) => s.pageviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
