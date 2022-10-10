import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import { TransferDto } from './dto/transfer.dto';

const TAG = '[MintService]';

@Injectable()
export class TransferSevice {
  private readonly logger = new Logger(TransferSevice.name);

  constructor(private readonly web3QuorumService: Web3QuorumService) {}

  async transfer(data: TransferDto): Promise<any> {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    return data;
  }
}
