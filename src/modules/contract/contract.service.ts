import { UpdateContractDto } from './dto/update-contract.dto';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { IContract, IContractKey } from './interfaces/contract.interface';

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

    const { address } = createContractDto;

    // get contractaddress that matches name
    const contractAddress = await this.contractRepository.findOne({
      where: { address },
    });

    // throw bad request error if contractAddress already exists
    if (contractAddress)
      throw new RpcException(
        `Contract with address "${address}" already exists`,
      );

    return await this.contractRepository.create(createContractDto);
  }

  /**
   * Get contract details that matched contract address
   * @param {string} address Contract Address
   * @returns The contract details
   */
  async getContractByAddress(address: string): Promise<any> {
    const METHOD = '[getContractByAddress]';
    this.logger.log(`${TAG} ${METHOD}`);

    // throw if contract address does not exist
    if (!address)
      throw new RpcException(`Contract address ${address} does not exist`);

    const contract = await this.contractRepository.findOne({
      where: {
        address,
      },
      select: {
        address: true,
        name: true,
        type: true,
        chainId: true,
        network: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { ...contract };
  }

  /**
   * Get contract details that matched contract address
   * @param {string} address Contract Address
   * @returns The contract details
   */
  async getContracts(): Promise<any> {
    const METHOD = '[getContracts]';
    this.logger.log(`${TAG} ${METHOD}`);

    const contract = await this.contractRepository.find();

    return { contract };
  }

  /**
   * Delete contract that matched contract address
   * @param {string} address Contract Address
   * @returns Delete status
   */
  async deleteContract(address: string) {
    const METHOD = '[deleteContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    // get contractaddress that matches name
    const contractAddress = await this.contractRepository.findOne({
      where: { address },
    });

    // throw bad request error if contractAddress does not exist
    if (!contractAddress)
      throw new RpcException(
        `Contract with address "${address}" does not exist`,
      );

    // delete
    return await this.contractRepository.delete(address);
  }

  /**
   * Update smart contract that matched contract address with new object parameters
   * @param {string} address Smart contract address
   * @param createContractDto Update contract using create contract dto as object parameter
   * @returns The updated contract
   */
  async updateContract(updateContractDto: UpdateContractDto): Promise<any> {
    const METHOD = '[updateContract]';
    this.logger.log(`${TAG} ${METHOD}`);

    const { address, name, type, chainId, network } = updateContractDto;

    // get contract address that matches address
    const contract = await this.contractRepository.findOne({
      where: { address },
    });

    // throw bad request error if contractAddress does not exist
    if (!contract)
      throw new RpcException(
        `Contract with address "${address}" does not exist`,
      );

    const updateContractModel: IContract = {
      address,
      name,
      type,
      chainId,
      network,
    };

    return await this.contractRepository.save(updateContractModel);
  }
}
