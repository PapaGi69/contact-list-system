import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import Web3 from 'web3';
import { AWSKMSService } from '../../providers/aws-kms';
import { ConfigService } from '@nestjs/config';
import {
  getErc20EncodedFunctionABI,
  RawTransactionOptions,
} from '../../utils/stablecoin.util';

const TAG = '[BurnService]';

@Injectable()
export class BurnService {
  private readonly logger = new Logger(BurnService.name);
  private readonly web3QuorumClient: Web3;
  private readonly chainAddresses: Record<string, string>;

  constructor(
    private readonly web3QuorumService: Web3QuorumService,
    private readonly awsKmsService: AWSKMSService,
    private readonly configService: ConfigService,
  ) {
    this.web3QuorumClient = this.web3QuorumService.getClient(
      this.configService.get('chain.transactionNode.name'),
    );
    this.chainAddresses = this.configService.get('chain.addresses');
  }

  async burn(fromAddress: string, amount: number, nonce: number): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    const burnParameters = [
      fromAddress,
      this.web3QuorumClient.utils.toWei(amount.toString()),
    ];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      burnParameters,
      'burn',
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );
    const transaction: RawTransactionOptions = {
      to: this.chainAddresses.phxContract,
      nonce,
      data: functionEncodedABI,
    };
    const signedTransaction = await this.awsKmsService.signTransaction(
      transaction,
      this.chainAddresses.adminBurner,
    );

    const transactionReceipt =
      await this.web3QuorumClient.eth.sendSignedTransaction(signedTransaction);

    return transactionReceipt;
  }
}
