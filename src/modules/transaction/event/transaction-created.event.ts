export interface TransactionCreatedEvent {
  transactionHash: string;
  from: string;
  to: string;
  value: string;
}
