import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Web3EthersService } from 'src/providers/web3-ethers';

import { RequestMintPermitDto } from './dto/request-mint-permit.dto';
import { BuildPermitParamsDto } from './dto/build-permit-params.dto';

import { MintPermitType } from './type/mint-permit.type';
import { MintPermitResponseType } from './type/mint-permit-response.type';

@Injectable()
export class PermitService {
  constructor(
    private readonly configModule: ConfigService,
    private readonly web3EthersService: Web3EthersService,
  ) {}
  
  async requestMintPermit(requestMintPermitDto: RequestMintPermitDto) {
    const { 
      buyerAddress, 
      sellerAddress,
    } = requestMintPermitDto;

    // Expiration of the mint permit
    const deadline = Date.now() + 300000;

    const buildPermitParamsDto = new BuildPermitParamsDto();

    // TODO: Populate the following via configModule.
    buildPermitParamsDto.chainId = '';
    buildPermitParamsDto.contractAddress = '';
    buildPermitParamsDto.domainName = '';
    buildPermitParamsDto.revision = '';
    buildPermitParamsDto.purchaser = buyerAddress;
    buildPermitParamsDto.seller = sellerAddress;
    buildPermitParamsDto.deadline = deadline.toString();

    const permit = this._buildMintPermitParams(buildPermitParamsDto);

    // TODO: POC nestjs-ethers wallet signer. 
    
    // TODO: Sign using `permit`. Check `Artifract` backend, `ChainService.js` for more details.

    // TODO: Populate the following via configModule.
    this.web3EthersService.sendTransaction('signed');
  }

  private async _buildMintPermitParams(
    buildPermitParamsDto: BuildPermitParamsDto
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

    // TODO: Populate the following via configModule.
    const mintPermitResponse: MintPermitResponseType = {
      types: {
        MintPermit,
      },
      domain: {
        name: '',
        version: '',
        chainId: '',
        verifyingContract: '',
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