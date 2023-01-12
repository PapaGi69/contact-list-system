export class CreateContractDto {
  channelId: string;
  deployer: string;
  address: string;
  name: string;
  type: string;
  chainId: string;
  network: string;
  revision: string;
  archived?: string;
  archivedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
