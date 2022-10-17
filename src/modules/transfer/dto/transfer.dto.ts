export class TransferDto {
  transactionId: string;
  requestId: string;
  channelId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  webhookURL: string;
}
