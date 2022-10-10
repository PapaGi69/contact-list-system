import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import { MintDto } from './dto/mint.dto';

const TAG = '[MintService]';

@Injectable()
export class MintService {
  private readonly logger = new Logger(MintService.name);

  constructor(private readonly web3QuorumService: Web3QuorumService) {}

  async mint(data: MintDto): Promise<any> {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    return data;
  }
}
