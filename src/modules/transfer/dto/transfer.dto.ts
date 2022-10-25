export class TransferDto {
  transactionId: string;
  requestId: string;
  channelId: string;
  ownerId: string;
  keyId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  webhookURL: string;
  createdAt: Date;
}
