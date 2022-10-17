import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSKMSService } from '../../providers/aws-kms';
import Web3 from 'web3';
import { Web3QuorumService } from '../../providers/web3-quorum';
import {
  getErc20EncodedFunctionABI,
  RawTransactionOptions,
} from '../../utils/stablecoin.util';

const TAG = '[MintService]';

@Injectable()
export class TransferSevice {
  private readonly logger = new Logger(TransferSevice.name);
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

  async transfer(
    fromAddress: string,
    toAddress: string,
    amount: number,
    nonce: number,
  ): Promise<any> {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    const transferParameters = [
      fromAddress,
      toAddress,
      this.web3QuorumClient.utils.toWei(amount.toString()),
    ];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      transferParameters,
      'transferFrom', // Can be change depending on the custom transfer implementation
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );

    // Approve the phx contract for token spending here

    const transaction: RawTransactionOptions = {
      to: this.chainAddresses.phxContract,
      nonce,
      data: functionEncodedABI,
    };

    const signedTransaction = await this.awsKmsService.signTransaction(
      transaction,
      this.chainAddresses.adminTransferer,
    );

    const transactionReceipt =
      await this.web3QuorumClient.eth.sendSignedTransaction(signedTransaction);

    return transactionReceipt;
  }
}
