import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  InjectEthersProvider,
  BaseProvider,
  EthersSigner,
  InjectSignerProvider,
  Wallet,
} from 'nestjs-ethers';

@Injectable()
export class Web3EthersService {
  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
    @InjectSignerProvider()
    private readonly ethersSigner: EthersSigner,
    private readonly configService: ConfigService,
  ) {}

  async sendTransaction(signedTransaction: string): Promise<any> {
    return this.ethersProvider.sendTransaction(signedTransaction);
  }

  async createWallet(contractDeployer: string): Promise<Wallet> {
    return this.ethersSigner.createWallet(
      this.configService.get(contractDeployer),
    );
  }

  async getChainId(wallet: Wallet): Promise<number> {
    return wallet.getChainId();
  }

  async signTypeData(wallet: Wallet, permit): Promise<any> {
    const { domain, types, message } = permit;
    return wallet._signTypedData(domain, types, message);
  }
}
