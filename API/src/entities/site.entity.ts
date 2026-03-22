import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session.entity';
import { Pageview } from './pageview.entity';
import { Event } from './event.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  domain: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean', default: false })
  public: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Session, (s) => s.site)
  sessions: Session[];

  @OneToMany(() => Pageview, (p) => p.site)
  pageviews: Pageview[];

  @OneToMany(() => Event, (e) => e.site)
  events: Event[];
}
