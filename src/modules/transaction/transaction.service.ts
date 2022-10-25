import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

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
}
