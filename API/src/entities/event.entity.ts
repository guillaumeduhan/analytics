import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Site } from './site.entity';
import { Session } from './session.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  site_id: string;

  @Column({ type: 'uuid' })
  session_id: string;

  @Column({ type: 'text' })
  visitor_id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  props: Record<string, unknown> | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  timestamp: Date;

  @ManyToOne(() => Site, (s) => s.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne(() => Session, (s) => s.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
