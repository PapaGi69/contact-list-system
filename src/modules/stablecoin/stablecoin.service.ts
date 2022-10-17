import { Logger, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MintDto } from '../mint/dto/mint.dto';
import { BurnDto } from '../burn/dto/burn.dto';
import { TransferDto } from '../transfer/dto/transfer.dto';
import { MintService } from '../mint/mint.service';
import { BurnService } from '../burn/burn.service';
import { TransferSevice } from '../transfer/transfer.service';
import {
  formatToBalance,
  getErc20Balance,
  getErc20EncodedFunctionABI,
  RawTransactionOptions,
} from '../../utils/stablecoin.util';
import { Web3QuorumService } from '../../providers/web3-quorum';
import { AWSKMSService } from '../../providers/aws-kms';
import Web3 from 'web3';
import { Cache } from 'cache-manager';

const TAG = '[StablecoinService]';

const PHX_DECIMALS = 18;

@Injectable()
export class StablecoinService {
  private readonly logger = new Logger(StablecoinService.name);
  private readonly web3QuorumClient: Web3;
  private readonly chainAddresses: Record<string, string>;

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    private readonly web3QuorumService: Web3QuorumService,
    private readonly awsKmsService: AWSKMSService,
    private readonly configService: ConfigService,
    private readonly mintService: MintService,
    private readonly burnService: BurnService,
    private readonly transferService: TransferSevice,
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

  async mint(data: MintDto): Promise<any> {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    // Get the ethereum address by kms key id
    const adminMinterAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminMinter,
    );

    const nonce = await this.getCurrentTransactionNonce(adminMinterAddress);
    const mintReceipt = await this.mintService.mint(
      data.toAddress,
      data.amount,
      nonce,
    );

    // Increment the current nonce
    await this.updateCurrentTransactionNonce(adminMinterAddress, nonce + 1);

    // Create transaction db entry
    console.log(mintReceipt);
  }

  async burn(data: BurnDto): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    // ---- Sign the transaction via AWS KMS Key ID ---- //
    // Get the ethereum address by kms key id
    const adminBurnerAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminBurner,
    );

    const nonce = await this.getCurrentTransactionNonce(adminBurnerAddress);
    const burnReceipt = await this.burnService.burn(
      data.fromAddress,
      data.amount,
      nonce,
    );

    await this.updateCurrentTransactionNonce(adminBurnerAddress, nonce + 1);

    console.log(burnReceipt);
  }

  async transfer(data: TransferDto): Promise<any> {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    const transferParameters = [data.fromAddress, data.toAddress, data.amount];
    const functionEncodedABI = getErc20EncodedFunctionABI(
      transferParameters,
      'transferFrom',
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );

    this.logger.log(
      `${TAG} ${METHOD} Encoded transfer function with parameters: ${functionEncodedABI}`,
    );

    // ---- Onwer of the tokens should allow the admin to transfer their tokens ---- //
    // ---- Sign the transaction via AWS KMS Key ID ---- //
    // Get the ethereum address by kms key id
    const adminMinterAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminMinter,
    );

    // Approve the phx contract for token spend here

    const transaction: RawTransactionOptions = {
      to: this.chainAddresses.phxContract,
      nonce: await this.web3QuorumClient.eth.getTransactionCount(
        adminMinterAddress,
      ),
      data: functionEncodedABI,
    };

    const signedTransaction = await this.awsKmsService.signTransaction(
      transaction,
      this.chainAddresses.adminMinter,
    );

    const transactionReceipt =
      await this.web3QuorumClient.eth.sendSignedTransaction(signedTransaction);
    console.log('transactionReceipt', transactionReceipt);

    return await this.transferService.transfer(data);
  }

  async getBalance(data: any): Promise<string> {
    const METHOD = '[getBalance]';
    this.logger.log(`${TAG} ${METHOD}`);

    const balance = await getErc20Balance(
      this.chainAddresses.phxContract,
      data.address,
      this.web3QuorumClient,
    );

    return formatToBalance(balance, PHX_DECIMALS);
  }

  async getCurrentTransactionNonce(address: string): Promise<number> {
    const METHOD = '[getCurrentTransactionNonce]';
    this.logger.log(`${TAG} ${METHOD}`);

    // Getting the current transaction count of address on contract not on network level
    // const contractInstance = new this.web3QuorumClient.eth.Contract();
    const cachedNonce = await this.cacheManager.get(`nonce-${address}`);
    if (!cachedNonce) {
      const curretNonce = await this.web3QuorumClient.eth.getTransactionCount(
        address,
      );
      this.logger.log(
        `${TAG} ${METHOD} Nonce for ${address} not found. Setting to updated nonce value: ${curretNonce}`,
      );
      await this.cacheManager.set(`nonce-${address}`, curretNonce);
      return curretNonce;
    }

    this.logger.log(
      `${TAG} ${METHOD} Using cached/updated nonce for ${address}: ${cachedNonce}`,
    );

    return cachedNonce as number;
  }

  async updateCurrentTransactionNonce(
    address: string,
    nonce: number,
  ): Promise<void> {
    const METHOD = '[updateCurrentTransactionNonce]';
    this.logger.log(`${TAG} ${METHOD}`);

    this.logger.log(
      `${TAG} ${METHOD} Updating cached nonce for ${address}: ${nonce}`,
    );

    await this.cacheManager.set(`nonce-${address}`, nonce);
  }
}
