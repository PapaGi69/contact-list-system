import { Injectable }  from '@nestjs/common';
import { InjectEthersProvider, BaseProvider } from 'nestjs-ethers';

@Injectable()
export class Web3EthersService {
  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
  ) {}

  async sendTransaction(signedTransaction: string): Promise<any> {
    return this.ethersProvider.sendTransaction(signedTransaction);
  }

  // TODO: POC: nestjs-ethers wallet signers
}