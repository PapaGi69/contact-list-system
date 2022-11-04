import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { BurnDto } from '../burn/dto/burn.dto';
import { MintDto } from '../mint/dto/mint.dto';
import { TransferDto } from '../transfer/dto/transfer.dto';
import { StablecoinService } from './stablecoin.service';

const TAG = '[StablecoinController]';

@Controller()
export class StablecoinController {
  private readonly logger = new Logger(StablecoinController.name);

  constructor(private readonly stablecoinService: StablecoinService) {}

  @MessagePattern('mint.stablecoin')
  async handleMintStablecoin(
    @Payload() data: MintDto,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleMintStablecoin]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.stablecoinService.mint(data);
  }

  @MessagePattern('burn.stablecoin')
  async handleBurnStablecoin(
    @Payload() data: BurnDto,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleBurnStablecoin]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.stablecoinService.burn(data);
  }

  @MessagePattern('transfer.stablecoin')
  async handleTransferStablecoin(
    @Payload() data: TransferDto,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleTransferStablecoin]';
    this.logger.log(`${TAG} ${METHOD}`);
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.stablecoinService.transfer(data);
  }

  @MessagePattern('stablecoin.wallet.balance')
  async handleGetStablecoinBalance(
    @Payload() data: any,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleGetStablecoinBalance]';
    this.logger.log(`${TAG} ${METHOD}`);
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.stablecoinService.getBalance(data);
  }

  @MessagePattern('stablecoin.totalsupply')
  async handleGetStablecoinTotalSupply(
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleGetStablecoinTotalSupply]';
    this.logger.log(`${TAG} ${METHOD}`);
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.stablecoinService.getTotalSupply();
  }
}
