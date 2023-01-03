import { CreateContractDto } from './dto/create-contract.dto';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { ContractService } from './contract.service';

const TAG = '[ContractController]';

@Controller()
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @MessagePattern('get.contract')
  async getContractByAddress(
    @Payload() data: CreateContractDto,
    @Ctx() context: KafkaContext,
  ) {
    const METHOD = '[getContractByAddress]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    const { address } = data;

    return await this.contractService.getContractById(address);
  }

  @MessagePattern('getall.contract')
  async getContracts(@Ctx() context: KafkaContext) {
    const METHOD = '[getContracts]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );

    return await this.contractService.getContracts();
  }

  @MessagePattern('create.contract')
  async createContract(
    @Payload() data: CreateContractDto,
    @Ctx() context: KafkaContext,
  ) {
    const METHOD = '[createContract]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );

    return await this.contractService.createContract(data);
  }

  @MessagePattern('delete.contract')
  async deleteContract(
    @Payload() data: CreateContractDto,
    @Ctx() context: KafkaContext,
  ) {
    const METHOD = '[deleteContract]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    const { address } = data;

    return await this.contractService.deleteContract(address);
  }

  @MessagePattern('update.contract')
  async updateContract(
    @Payload() data: CreateContractDto,
    @Ctx() context: KafkaContext,
  ) {
    const METHOD = '[updateContract]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );

    return await this.contractService.updateContract(data);
  }
}
