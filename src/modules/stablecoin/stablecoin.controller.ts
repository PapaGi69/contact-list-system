import { Logger, Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BurnDto } from '../burn/dto/burn.dto';
import { MintDto } from '../mint/dto/mint.dto';
import { TransferDto } from '../transfer/dto/transfer.dto';
import { StablecoinService } from './stablecoin.service';

const TAG = '[StablecoinController]';

@ApiTags('Stablecoin')
@Controller({ path: 'stablecoin'})
export class StablecoinController {
  private readonly logger = new Logger(StablecoinController.name);

  constructor(private readonly stablecoinService: StablecoinService) {}

  @MessagePattern('mint.stablecoin')
  async handleMintStablecoin(@Payload() data: MintDto) {
    const METHOD = '[handleMintStablecoin]';
    this.logger.log(`${TAG} ${METHOD}`);
    return await this.stablecoinService.mint(data);
  }

  @MessagePattern('burn.stablecoin')
  async handleBurnStablecoin(@Payload() data: BurnDto) {
    const METHOD = '[handleBurnStablecoin]';
    this.logger.log(`${TAG} ${METHOD}`);
    return await this.stablecoinService.burn(data);
  }

  @MessagePattern('transfer.stablecoin')
  async handleTransferStablecoin(@Payload() data: TransferDto) {
    const METHOD = '[handleTransferStablecoin]';
    this.logger.log(`${TAG} ${METHOD}`);
    return await this.stablecoinService.transfer(data);
  }

  @Post('mint')
  @HttpCode(HttpStatus.CREATED)
  async mint(@Body() data: MintDto) {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.stablecoinService.mint(data);
  }

  @Post('burn')
  @HttpCode(HttpStatus.CREATED)
  async burn(@Body() data: BurnDto) {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.stablecoinService.burn(data);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  async transfer(@Body() data: TransferDto) {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.stablecoinService.transfer(data);
  }
}
