import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { TransactionCreatedEvent } from './event/transaction-created.event';
import { TransactionService } from './transaction.service';

const TAG = '[TransactionController]';

@Controller('transaction')
export class TransactionController {
  private logger = new Logger(TransactionController.name);

  constructor(private transactionService: TransactionService) {}

  @MessagePattern('chain.emitted.event')
  async handleTransactionCreatedEvent(
    @Payload() data: TransactionCreatedEvent,
    @Ctx() context: KafkaContext,
  ) {
    const METHOD = '[handleTransactionCreatedEvent]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );

    try {
      await this.transactionService.handleTransactionCreatedEvent(data);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
