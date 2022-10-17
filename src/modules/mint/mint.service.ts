import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import Web3 from 'web3';
import { AWSKMSService } from '../../providers/aws-kms';
import { ConfigService } from '@nestjs/config';
import {
  getErc20EncodedFunctionABI,
  RawTransactionOptions,
} from '../../utils/stablecoin.util';

const TAG = '[MintService]';

@Injectable()
export class MintService {
  private readonly logger = new Logger(MintService.name);
  private readonly web3QuorumClient: Web3;
  private readonly chainAddresses: Record<string, string>;

  constructor(
    private readonly web3QuorumService: Web3QuorumService,
    private readonly awsKmsService: AWSKMSService,
    private readonly configService: ConfigService,
  ) {
    // transaction node url should be tied to a channel.
    // in maw-bebs, channel has a corresponding
    // transaction node; so that we can implement the channel to
    // channel token transfer.
    this.web3QuorumClient = this.web3QuorumService.getClient(
      this.configService.get('chain.transactionNode.name'),
    );
    // For multiple nodes setup, phxContract should be added/deployed for channel's node
    // and maybe we need to store it on another dynamo db table and tied it with channels
    this.chainAddresses = this.configService.get('chain.addresses');
  }

  async mint(toAddress: string, amount: number, nonce: number): Promise<any> {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    const mintParameters = [toAddress, amount.toString()];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      mintParameters,
      'mint',
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );

    const transaction: RawTransactionOptions = {
      to: this.chainAddresses.phxContract,
      // Each transaction has a nonce (number used only once)
      // https://www.investopedia.com/terms/n/nonce.asp
      nonce,
      data: functionEncodedABI,
    };

    const signedTransaction = await this.awsKmsService.signTransaction(
      transaction,
      this.chainAddresses.adminMinter,
    );

    const transactionReceipt =
      await this.web3QuorumClient.eth.sendSignedTransaction(signedTransaction);

    return transactionReceipt;
  }
}
