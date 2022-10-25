import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

const TAG = '[TransactionController]';

@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('transaction.request.id.get')
  async handleGetTransactionByRequestId(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleGetTransactionByRequestId]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    const { channelId, requestId } = data;
    return await this.transactionService.getTransactionByRequestId(
      channelId,
      requestId,
    );
  }
}
