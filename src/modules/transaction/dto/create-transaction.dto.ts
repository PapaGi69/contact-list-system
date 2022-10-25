import { TransactionStatus } from '../enum/transaction-status.enum';
import { TransactionType } from '../enum/transaction-type.enum';

export class CreateTransactionDto {
  requestId: string;
  from?: string;
  to?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  ownerId: string;
  channelId: string;
  webhookURL: string;
  createdAt?: Date;
  updatedAt?: Date;
}
