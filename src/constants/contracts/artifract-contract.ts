import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import artifractAbi from '../abis/artifract-abi';

export const ArtifractContract = (tokenAddress: string, provider: Web3): Contract =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  new provider.eth.Contract(artifractAbi, tokenAddress);
