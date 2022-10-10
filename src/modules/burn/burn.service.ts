import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import { BurnDto } from './dto/burn.dto';

const TAG = '[BurnService]';

@Injectable()
export class BurnService {
  private readonly logger = new Logger(BurnService.name);

  constructor(private readonly web3QuorumService: Web3QuorumService) {}

  async burn(data: BurnDto): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    return data;
  }
}
