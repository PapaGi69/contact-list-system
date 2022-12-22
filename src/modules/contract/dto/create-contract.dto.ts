export class CreateContractDto {
  address: string;
  name: string;
  type: string;
  chainId: string;
  network: string;
  createdAt?: Date;
  updatedAt?: Date;
}
