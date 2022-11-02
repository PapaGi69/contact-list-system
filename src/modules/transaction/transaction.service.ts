import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionCreatedEvent } from './event/transaction-created.event';
import { RpcException } from '@nestjs/microservices';

const TAG = '[TransactionService]';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(data: CreateTransactionDto): Promise<any> {
    const METHOD = '[createTransaction]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.transactionRepository.save(data);
  }

  async getTransactionByRequestId(
    channelId: string,
    requestId: string,
  ): Promise<any> {
    const METHOD = '[getTransactionByRequestId]';
    this.logger.log(`${TAG} ${METHOD}`);

    const transaction = await this.transactionRepository.findOne({
      where: {
        channelId,
        requestId,
      },
      select: {
        requestId: true,
        from: true,
        to: true,
        amount: true,
        type: true,
        status: true,
        transactionHash: true,
        ownerId: true,
        channelId: true,
        webhookURL: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { ...transaction };
  }

  async handleTransactionCreatedEvent(data: TransactionCreatedEvent) {
    const METHOD = '[handleTransactionCreatedEvent]';
    this.logger.log(`${TAG} ${METHOD}`);

    const { transactionHash } = data;

    // get transaction by transactionHash
    const transaction = await this.transactionRepository.findOne({
      where: { transactionHash },
    });

    // throw if transaction does not exist
    if (!transaction)
      throw new RpcException(
        `Transaction with hash ${transactionHash} does not exist`,
      );

    // update transaction status to SUCCESS
    transaction.status = 'SUCCESS';
    await this.transactionRepository.save(transaction);

    // TODO
    // call webhook url to update other service on the transaction
    //
    // - FR: Oliver
    // Ignore error response from the webhook url
    // Add retry logic for failed webhook calls
  }
}
