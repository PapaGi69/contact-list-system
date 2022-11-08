import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Web3EthersService } from 'src/providers/web3-ethers';

import { RequestMintPermitDto } from './dto/request-mint-permit.dto';
import { BuildPermitParamsDto } from './dto/build-permit-params.dto';

import { MintPermitType } from './type/mint-permit.type';
import { MintPermitResponseType } from './type/mint-permit-response.type';
import { Wallet } from 'nestjs-ethers';
import { ethers } from 'ethers';

const TAG = '[ChainService]';

@Injectable()
export class PermitService {
  private readonly logger = new Logger(PermitService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly web3EthersService: Web3EthersService,
  ) {}

  async requestMintPermit(requestMintPermitDto: RequestMintPermitDto) {
    const METHOD = '[requestMintPermit]';
    this.logger.log(`${TAG} ${METHOD}`);

    const { buyerAddress, sellerAddress } = requestMintPermitDto;

    // Expiration of the mint permit
    const deadline = Date.now() + 300000;

    const buildPermitParamsDto = new BuildPermitParamsDto();

    // BuildPermitParamsDto Config
    buildPermitParamsDto.chainId = this.configService.get(
      'ethers-chain.smartContract.rpcProvider',
    );
    buildPermitParamsDto.contractAddress = this.configService.get(
      'ethers-chain.smartContract.smartContractAddress',
    );
    buildPermitParamsDto.domainName = this.configService.get(
      'ethers-chain.smartContract.domainName',
    );
    buildPermitParamsDto.revision = this.configService.get(
      'ethers-chain.smartContract.revision',
    );
    buildPermitParamsDto.purchaser = buyerAddress;
    buildPermitParamsDto.seller = sellerAddress;
    buildPermitParamsDto.deadline = deadline.toString();

    // Build mint permit
    const permit = await this.buildMintPermitParams(buildPermitParamsDto);

    const wallet: Wallet = await this.web3EthersService.createWallet(
      this.configService.get('ethers-chain.smartContract.contractDeployer'),
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

      this.logger.log(
        sign ===
          (await this.configService.get(
            'ethers-chain.smartContract.deployerPublicKey',
          )),
      );
    } catch (error) {
      this.logger.error(error);
    }

    this.web3EthersService.sendTransaction('signed');
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

  private async buildMintPermitParams(
    buildPermitParamsDto: BuildPermitParamsDto,
  ): Promise<MintPermitResponseType> {
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
