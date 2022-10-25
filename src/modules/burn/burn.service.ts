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

const TAG = '[BurnService]';

@Injectable()
export class BurnService {
  private readonly logger = new Logger(BurnService.name);
  private readonly web3QuorumClient: Web3;
  private readonly chainAddresses: Record<string, string>;
  private readonly eip712Details: Record<string, string>;

  constructor(
    private readonly web3QuorumService: Web3QuorumService,
    private readonly awsKmsService: AWSKMSService,
    private readonly configService: ConfigService,
  ) {
    this.web3QuorumClient = this.web3QuorumService.getClient(
      this.configService.get('chain.transactionNode.name'),
    );
    this.chainAddresses = this.configService.get('chain.addresses');
    this.eip712Details = this.configService.get('chain.eip712');
  }

  async burn(fromAddress: string, amount: string, nonce: number): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    const burnParameters = [fromAddress, amount];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      burnParameters,
      'burn',
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );

    // Burn Permit
    const adminBurnerAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminBurner,
    );
    const types = this._buildPermitTypes();
    const message = { burner: adminBurnerAddress, from: fromAddress, amount };
    const domain = buildEip712Domain(
      this.eip712Details.domainName,
      this.eip712Details.version,
      Number(this.eip712Details.chainId),
      this.chainAddresses.phxContract,
    );
    // Sign the permit with admin burner key
    const burnPermit = await this.awsKmsService.signTypedData(
      domain,
      types,
      message,
      this.chainAddresses.adminBurner,
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

  _buildPermitTypes(): Record<string, any> {
    return {
      Permit: [
        // Can add or remove new types
        { name: 'burner', type: 'address' }, // Admin minter address or the signer address
        { name: 'from', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    };
  }
}
