export class MintDto {
  transactionId: string;
  requestId: string;
  channelId: string;
  ownerId: string;
  keyId: string;
  toAddress: string;
  amount: number;
  webhookURL: string;
  createdAt: Date;
}
