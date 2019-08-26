import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ResponseType } from 'axios';

@Entity()
export class MockResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string;

  @Column({ length: 6 })
  method: string;

  @Column('smallint')
  status: number;

  @Column('json')
  headers: {};

  @Column()
  type: ResponseType;

  @Column({ type: 'json', nullable: true })
  data?: {};

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'bytea', nullable: true })
  binary?: Buffer;
}
