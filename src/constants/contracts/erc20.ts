import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import erc20Abi from '../abis/erc20';

export const ERC20 = (tokenAddress: string, provider: Web3): Contract =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  new provider.eth.Contract(erc20Abi, tokenAddress);
