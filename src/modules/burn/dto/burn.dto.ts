export class BurnDto {
  transactionId: string;
  requestId: string;
  channelId: string;
  ownerId: string;
  keyId: string;
  fromAddress: string;
  amount: number;
  webhookURL: string;
  createdAt: Date;
}
