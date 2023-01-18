import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Web3EthersService } from 'src/providers/web3-ethers';

import { RequestMintPermitDto } from './dto/request-mint-permit.dto';
import { BuildPermitParamsDto } from './dto/build-permit-params.dto';

import { MintPermitType } from './type/mint-permit.type';
import { MintPermitResponseType } from './type/mint-permit-response.type';
import { Wallet } from 'nestjs-ethers';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from '../contract/entities/contract.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PermitService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly configService: ConfigService,
    private readonly web3EthersService: Web3EthersService,
  ) {}

  private readonly TAG = '[PermitService]';
  private readonly logger = new Logger(`${this.TAG}`);

  /**
   * Request minting permit signature from smart contract
   * @param {string} buyerAddress Buyer wallet address
   * @param {string} sellerAddress Seller wallet address
   * @return {string} The signature from smart contract for minting permit
   */
  async requestMintPermit(requestMintPermitDto: RequestMintPermitDto) {
    const METHOD = '[requestMintPermit]';
    this.logger.log(`${METHOD}`);

    const { channelId, buyerAddress, sellerAddress } = requestMintPermitDto;

    const contract = await this.contractRepository.findOne({
      where: {
        channelId,
        archived: 'false',
      },
    });

    // throw bad request error if contract does not exist
    if (!contract)
      throw new RpcException(
        `Contract with channelId "${channelId}" does not exist`,
      );

    // deconstruct contract
    const { deployer, address, name, revision } = contract;

    // Expiration of the mint permit
    const deadline = Date.now() + 300000;

    // Assingning BuildPermitParamsDto
    const buildPermitParamsDto = new BuildPermitParamsDto();

    // Contract deployer
    const wallet: Wallet = await this.web3EthersService.createWallet(deployer);

    // BuildPermitParamsDto Config
    buildPermitParamsDto.chainId = await this.web3EthersService.getChainId(
      wallet,
    );
    buildPermitParamsDto.contractAddress = address;
    buildPermitParamsDto.domainName = name;
    buildPermitParamsDto.revision = revision;
    buildPermitParamsDto.purchaser = buyerAddress;
    buildPermitParamsDto.seller = sellerAddress;
    buildPermitParamsDto.deadline = deadline.toString();

    // Build mint permit
    const permit: MintPermitResponseType = await this._buildMintPermitParams(
      buildPermitParamsDto,
    );

    try {
      // Permit signed by the contract deployer
      const signature = await this.web3EthersService.signTypeData(
        wallet,
        permit,
      );

      // Verify if the signature is from the contract deployer
      const sign = ethers.utils.verifyTypedData(
        permit.domain,
        permit.types,
        permit.message,
        signature,
      );

      // Check if sign is equal to wallet address of deployer
      this.logger.log(
        sign ===
          (await this.configService.get(
            'chain.smartContract.deployerPublicKey',
          )),
      );

      const address = buildPermitParamsDto.contractAddress;

      return {
        signature,
        address,
        deadline,
        // Transaction status Success to discuss
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Build mint permit parameter object
   * @param {number} chainId
   * @param {string} contractAddress
   * @param {string} domainName
   * @param {string} revision
   * @param {string} purchaser
   * @param {number} deadline
   * @return {object} The mint permit parameter object
   */
  private async _buildMintPermitParams(
    buildPermitParamsDto: BuildPermitParamsDto,
  ): Promise<MintPermitResponseType> {
    const METHOD = '[_buildMintPermitParams]';
    this.logger.log(`${METHOD}`);

    const {
      chainId,
      contractAddress,
      domainName,
      revision,
      purchaser,
      seller,
      deadline,
    } = buildPermitParamsDto;

    const MintPermit: MintPermitType = [
      { name: 'purchaser', type: 'address' },
      { name: 'seller', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ];

    const mintPermitResponse: MintPermitResponseType = {
      types: {
        MintPermit,
      },
      domain: {
        name: domainName,
        version: revision,
        chainId: chainId,
        verifyingContract: contractAddress,
      },
      message: {
        purchaser,
        seller,
        deadline,
      },
    };

    return mintPermitResponse;
  }
}
