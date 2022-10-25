import { Logger, Injectable } from '@nestjs/common';
import { Web3QuorumService } from '../../providers/web3-quorum';
import Web3 from 'web3';
import { AWSKMSService } from '../../providers/aws-kms';
import { ConfigService } from '@nestjs/config';
import {
  buildEip712Domain,
  getErc20EncodedFunctionABI,
  RawTransactionOptions,
} from '../../utils/stablecoin.util';

const TAG = '[MintService]';

@Injectable()
export class MintService {
  private readonly logger = new Logger(MintService.name);
  private readonly web3QuorumClient: Web3;
  private readonly chainAddresses: Record<string, string>;
  private readonly eip712Details: Record<string, string>;

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
    this.eip712Details = this.configService.get('chain.eip712');
  }

  async mint(toAddress: string, amount: string, nonce: number): Promise<any> {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    const mintParameters = [toAddress, amount];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      mintParameters,
      'mint',
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );

    // Mint Permit
    const adminMinterAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminMinter,
    );
    const types = this._buildPermitTypes();
    const message = { minter: adminMinterAddress, to: toAddress, amount };
    const domain = buildEip712Domain(
      this.eip712Details.domainName,
      this.eip712Details.version,
      Number(this.eip712Details.chainId),
      this.chainAddresses.phxContract,
    );
    // Sign the permit with admin minter key
    const mintPermit = await this.awsKmsService.signTypedData(
      domain,
      types,
      message,
      this.chainAddresses.adminMinter,
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

  _buildPermitTypes(): Record<string, any> {
    return {
      Permit: [
        // Can add or remove new types
        { name: 'minter', type: 'address' }, // Admin minter address or the signer address
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    };
  }
}
