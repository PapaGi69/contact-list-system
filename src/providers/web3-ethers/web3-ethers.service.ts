import { Injectable }  from '@nestjs/common';
import { InjectEthersProvider, BaseProvider } from 'nestjs-ethers';

@Injectable()
export class Web3EthersService {
  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
  ) {}
  async getNetwork(): Promise<any> {
    return this.ethersProvider.getNetwork();
  }
}