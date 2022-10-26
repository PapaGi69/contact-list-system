import { getErc20TotalSupply } from './../../utils/stablecoin.util';
import { Logger, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MintDto } from '../mint/dto/mint.dto';
import { BurnDto } from '../burn/dto/burn.dto';
import { TransferDto } from '../transfer/dto/transfer.dto';
import { MintService } from '../mint/mint.service';
import { BurnService } from '../burn/burn.service';
import { TransferSevice } from '../transfer/transfer.service';
import {
  formatFromBalance,
  formatToBalance,
  getErc20Balance,
} from '../../utils/stablecoin.util';
import { Web3QuorumService } from '../../providers/web3-quorum';
import { AWSKMSService } from '../../providers/aws-kms';
import Web3 from 'web3';
import { Cache } from 'cache-manager';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '../transaction/enum/transaction-type.enum';
import { TransactionStatus } from '../transaction/enum/transaction-status.enum';

const TAG = '[StablecoinService]';

const PHX_DECIMALS = 18; // Should be added in contract storage

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
    private readonly transactionService: TransactionService,
  ) {
    // transaction node url should be tied to a channel.
    // in maw-bebs, channel has a corresponding
    // transaction node; so that we can implement the channel to
    // channel token transfer.
    this.web3QuorumClient = this.web3QuorumService.getClient(
      this.configService.get('chain.transactionNode.name'),
    );
    // For multiple nodes setup, phxContract should be added/deployed on channel's node
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

    const mintReceipt = await this.mintService.mint(
      data.toAddress,
      formatToBalance(data.amount.toString(), PHX_DECIMALS),
      await this.getCurrentTransactionNonce(adminMinterAddress),
    );

    await this.transactionService.createTransaction({
      requestId: data.requestId,
      to: data.toAddress,
      amount: data.amount,
      type: TransactionType.MINT,
      status: TransactionStatus.PROCESSING,
      transactionHash: mintReceipt.transactionHash,
      ownerId: data.ownerId,
      channelId: data.channelId,
      webhookURL: data.webhookURL,
      createdAt: data.createdAt,
    });

    return mintReceipt;
  }

  async burn(data: BurnDto): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    const adminBurnerAddress = await this.awsKmsService.getEthAddressByKeyId(
      this.chainAddresses.adminBurner,
    );
    const burnReceipt = await this.burnService.burn(
      data.fromAddress,
      formatToBalance(data.amount.toString(), PHX_DECIMALS),
      await this.getCurrentTransactionNonce(adminBurnerAddress),
    );

    await this.transactionService.createTransaction({
      requestId: data.requestId,
      from: data.fromAddress,
      amount: data.amount,
      type: TransactionType.BURN,
      status: TransactionStatus.PROCESSING,
      transactionHash: burnReceipt.transactionHash,
      ownerId: data.ownerId,
      channelId: data.channelId,
      webhookURL: data.webhookURL,
      createdAt: data.createdAt,
    });

    return burnReceipt;
  }

  async transfer(data: TransferDto): Promise<any> {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    const transferReceipt = await this.transferService.transfer(
      data.toAddress,
      formatToBalance(data.amount.toString(), PHX_DECIMALS),
      await this.getCurrentTransactionNonce(data.fromAddress),
      data.keyId,
    );

    await this.transactionService.createTransaction({
      requestId: data.requestId,
      from: data.fromAddress,
      to: data.toAddress,
      amount: data.amount,
      type: TransactionType.TRANSFER,
      transactionHash: transferReceipt.transactionHash,
      status: TransactionStatus.PROCESSING,
      ownerId: data.ownerId,
      channelId: data.channelId,
      webhookURL: data.webhookURL,
      createdAt: data.createdAt,
    });

    return transferReceipt;
  }

  async getBalance(data: any): Promise<string> {
    const METHOD = '[getBalance]';
    this.logger.log(`${TAG} ${METHOD}`);

    const balance = await getErc20Balance(
      this.chainAddresses.phxContract,
      data.address,
      this.web3QuorumClient,
    );

    return formatFromBalance(balance, PHX_DECIMALS);
  }

  async getCurrentTransactionNonce(address: string): Promise<number> {
    const METHOD = '[getCurrentTransactionNonce]';
    this.logger.log(`${TAG} ${METHOD}`);

    // Getting the current transaction count of address on contract not on network level
    // const cachedNonce = await this.cacheManager.get(`nonce-${address}`);
    // if (!cachedNonce) {
    //   const curretNonce = await this.web3QuorumClient.eth.getTransactionCount(
    //     address,
    //   );
    //   this.logger.log(
    //     `${TAG} ${METHOD} Nonce for ${address} not found. Setting to updated nonce value: ${curretNonce}`,
    //   );
    //   await this.cacheManager.set(`nonce-${address}`, curretNonce);
    //   return curretNonce;
    // }

    // this.logger.log(
    //   `${TAG} ${METHOD} Using cached/updated nonce for ${address}: ${cachedNonce}`,
    // );

    // return cachedNonce as number;
    return await this.web3QuorumClient.eth.getTransactionCount(address);
  }

  async updateCurrentTransactionNonce(
    address: string,
    nonce: number,
  ): Promise<void> {
    const METHOD = '[updateCurrentTransactionNonce]';
    this.logger.log(`${TAG} ${METHOD}`);

    this.logger.log(`${TAG} ${METHOD} Updated nonce for ${address}: ${nonce}`);

    await this.cacheManager.set(`nonce-${address}`, nonce);
  }

  async getTotalSupply(): Promise<string> {
    const METHOD = '[getTotalSupply]';
    this.logger.log(`${TAG} ${METHOD}`);

    const totalSupply = await getErc20TotalSupply(
      this.chainAddresses.phxContract,
      this.web3QuorumClient,
    );
    return formatFromBalance(totalSupply, PHX_DECIMALS);
  }
}
