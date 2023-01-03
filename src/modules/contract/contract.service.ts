import { UpdateContractDto } from './dto/update-contract.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { IContract } from './interfaces/contract.interface';

const TAG = '[ContractService]';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  /**
   * Create smart contract
   * @param createContractDto Create Contract object parameter
   * @returns The new smart contract
   */
  async createContract(createContractDto: CreateContractDto): Promise<any> {
    const METHOD = '[createContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    const { channelId } = createContractDto;

    // get channelId that matches name
    const contract = await this.contractRepository.findOne({
      where: { channelId },
    });

    // throw bad request error if channelId already exists
    if (contract)
      throw new RpcException(
        `Contract with channelId "${channelId}" already exists`,
      );

    return await this.contractRepository.create(createContractDto);
  }

  /**
   * Get contract details that matched channelId
   * @param {string} channelId Channel ID
   * @returns The contract details
   */
  async getContractById(channelId: string): Promise<any> {
    const METHOD = '[getContractByAddress]';
    this.logger.log(`${TAG} ${METHOD}`);

    // throw if channelId does not exist
    if (!channelId)
      throw new RpcException(
        `Contract with channelId "${channelId}" does not exist`,
      );

    const contract = await this.contractRepository.findOne({
      where: {
        channelId,
      },
    });

    return { ...contract };
  }

  /**
   * Get all contracts
   * @returns All contracts
   */
  async getContracts(): Promise<any> {
    const METHOD = '[getContracts]';
    this.logger.log(`${TAG} ${METHOD}`);

    const contract = await this.contractRepository.find();

    return { contract };
  }

  /**
   * Delete contract that matched channelId
   * @param {string} channelId Channel ID
   * @returns Delete status
   */
  async deleteContract(channelId: string) {
    const METHOD = '[deleteContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    // get channelId that matches name
    const contract = await this.contractRepository.findOne({
      where: { channelId },
    });

    // throw bad request error if contractAddress does not exist
    if (!contract)
      throw new RpcException(
        `Contract with channelId "${channelId}" does not exist`,
      );

    // delete
    return await this.contractRepository.delete(channelId);
  }

  /**
   * Update smart contract that matched channelId with new object parameters
   * @param {string} channelId Channel ID
   * @param createContractDto Update contract using create contract dto as object parameter
   * @returns The updated contract
   */
  async updateContract(updateContractDto: UpdateContractDto): Promise<any> {
    const METHOD = '[updateContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    const {
      channelId,
      deployer,
      address,
      name,
      type,
      chainId,
      network,
      revision,
    } = updateContractDto;

    // get contract that matches channelId
    const contract = await this.contractRepository.findOne({
      where: { channelId },
    });

    // throw bad request error if channelId does not exist
    if (!contract)
      throw new RpcException(
        `Contract with channelId "${channelId}" does not exist`,
      );

    const updateContractModel: IContract = {
      channelId,
      deployer,
      address,
      name,
      type,
      chainId,
      network,
      revision,
    };

    return await this.contractRepository.save(updateContractModel);
  }
}
