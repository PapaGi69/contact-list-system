import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  InjectEthersProvider,
  BaseProvider,
  EthersSigner,
  InjectSignerProvider,
  Wallet,
  TransactionResponse,
} from 'nestjs-ethers';

import { MintPermitResponseType } from 'src/modules/permit/type/mint-permit-response.type';

@Injectable()
export class Web3EthersService {
  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
    @InjectSignerProvider()
    private readonly ethersSigner: EthersSigner,
  ) {}

  private readonly TAG = '[Web3EthersService]';
  private readonly logger = new Logger(`${this.TAG}`);

  async sendTransaction(
    signedTransaction: string,
  ): Promise<TransactionResponse> {
    const METHOD = '[sendTransaction]';
    this.logger.log(`${METHOD}`);

    return this.ethersProvider.sendTransaction(signedTransaction);
  }

  async createWallet(contractDeployer: any): Promise<Wallet> {
    const METHOD = '[createWallet]';
    this.logger.log(`${METHOD}`);
    this.logger.log(contractDeployer);

    return this.ethersSigner.createWallet(contractDeployer);
  }

  async getChainId(wallet: Wallet): Promise<number> {
    const METHOD = '[getChainId]';
    this.logger.log(`${METHOD}`);

    return wallet.getChainId();
  }

  async signTypeData(
    wallet: Wallet,
    permit: MintPermitResponseType,
  ): Promise<string> {
    const METHOD = '[signTypeData]';
    this.logger.log(`${METHOD}`);

    const { domain, types, message } = permit;

    this.logger.log(domain, message);

    return wallet._signTypedData(domain, types, message);
  }
}
