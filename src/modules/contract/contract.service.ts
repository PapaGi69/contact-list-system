import { UpdateContractDto } from './dto/update-contract.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';

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

    const newContract: Contract = {
      ...createContractDto,
    };

    return await this.contractRepository.save(newContract);
  }

  /**
   * Get contract details that matched channelId
   * @param {string} channelId Channel ID
   * @returns The contract details
   */
  async getContractById(channelId: string): Promise<any> {
    const METHOD = '[getContractByAddress]';
    this.logger.log(`${TAG} ${METHOD}`);

    const contract = await this.contractRepository.findOne({
      where: {
        channelId,
        archived: 'false',
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

    return await this.contractRepository.find({
      where: {
        archived: 'false',
      },
    });
  }

  /**
   * Soft delete contract that matched channelId
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

    // update the archived and archived at values
    await this.contractRepository.save({
      ...contract,
      archived: 'true',
      archivedAt: new Date(),
    });
  }

  /**
   * Update smart contract that matched channelId with new object parameters
   * @param createContractDto Update contract using create contract dto as object parameter
   * @returns The updated contract
   */
  async updateContract(updateContractDto: UpdateContractDto): Promise<any> {
    const METHOD = '[updateContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    const { channelId } = updateContractDto;

    // get contract that matches channelId
    const contract = await this.contractRepository.findOne({
      where: { channelId },
    });

    // throw bad request error if contract does not exist
    if (!contract)
      throw new RpcException(
        `Contract with channelId "${channelId}" does not exist`,
      );

    return await this.contractRepository.save({
      ...contract,
      ...updateContractDto,
    });
  }
}
