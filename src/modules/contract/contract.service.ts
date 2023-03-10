import { UpdateContractDto } from './dto/update-contract.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const { channelId } = createContractDto;

    const contract = await this.contractRepository.findOne({
      where: {
        channelId,
        archived: 'false',
      },
    });

    // throw bad request error if contract does not exist
    if (contract)
      throw new BadRequestException(
        `Contract with channelId "${createContractDto.channelId}" already exists`,
      );

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
  async getContractByChannelId(channelId: string): Promise<any> {
    const METHOD = '[getContractByChannelId]';
    this.logger.log(`${TAG} ${METHOD}`);

    const contract = await this.contractRepository.findOne({
      where: {
        channelId,
        archived: 'false',
      },
      select: {
        id: true,
        channelId: true,
        publicKey: true,
        address: true,
        name: true,
        type: true,
        chainId: true,
        network: true,
        revision: true,
        createdAt: true,
        updatedAt: true,
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
      select: {
        id: true,
        channelId: true,
        publicKey: true,
        address: true,
        name: true,
        type: true,
        chainId: true,
        network: true,
        revision: true,
        createdAt: true,
        updatedAt: true,
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
      where: {
        channelId,
        archived: 'false',
      },
    });

    // throw bad request error if contract does not exist
    if (!contract)
      throw new BadRequestException(
        `Contract with channelId "${channelId}" does not exists`,
      );

    // update the archived and archived at values
    return await this.contractRepository.save({
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
      where: {
        channelId,
        archived: 'false',
      },
    });

    // throw bad request error if contract does not exist
    if (!contract)
      throw new BadRequestException(
        `Contract with channelId "${channelId}" does not exists`,
      );

    return await this.contractRepository.save({
      ...contract,
      ...updateContractDto,
    });
  }
}
