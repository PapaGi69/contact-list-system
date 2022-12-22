export interface IContractKey {
  address: string;
}

export interface IContract extends IContractKey {
  name: string;
  type: string;
  chainId: string;
  network: string;
  updatedAt?: Date;
}
