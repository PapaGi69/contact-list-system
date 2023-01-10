export interface IContract {
  channelId: string;
  deployer: string;
  address: string;
  name: string;
  type: string;
  chainId: string;
  network: string;
  revision: string;
  archived?: boolean;
  archivedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
