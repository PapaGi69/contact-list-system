import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../enum/transaction-status.enum';
import { TransactionType } from '../enum/transaction-type.enum';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  requestId: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  to: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ enum: TransactionType })
  type: string;

  @Column({ enum: TransactionStatus })
  status: string;

  @Column()
  ownerId: string;

  @Column({ type: 'uuid' })
  channelId: string;

  @Column()
  webhookURL: string;

  @CreateDateColumn() // Date will be coming from orchestrator
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
