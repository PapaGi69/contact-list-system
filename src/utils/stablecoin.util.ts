import { ERC20 } from '../constants/contracts/erc20';
import {
  formatUnits,
  parseUnits,
  serializeTransaction,
} from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import Web3 from 'web3';

export const getErc20Balance = async (
  token: string,
  address: string,
  provider: Web3,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
): Promise<string> => ERC20(token, provider).methods.balanceOf(address).call();

export const getErc20TotalSupply = async (
  token: string,
  provider: Web3,
): Promise<string> => ERC20(token, provider).methods.totalSupply().call();

export const getErc20EncodedFunctionABI = (
  args: any,
  methodName: string,
  token: string,
  provider: Web3,
) => {
  return ERC20(token, provider)
    .methods[methodName](...args)
    .encodeABI();
};

export const formatFromBalance = (value: string, decimals: number): string => {
  return formatUnits(value, decimals).toString();
};

export const formatToBalance = (value: string, decimals: number): string => {
  return parseUnits(value, decimals).toString();
};

export interface RawTransactionOptions {
  to: string;
  nonce: number;
  value?: number | BigNumber;
  gasLimit?: number | BigNumber;
  gasPrice?: number | BigNumber;
  data: string;
  isPrivate?: boolean; // Tag as private transaction between node participants; and web3js-quorum will call the transaction manager to encrypt/decript the data between parties
  privateFrom?: string; // Sender node's transaction manager public key
  privateFor?: string[]; // Array of transaction manager nodepublic keys
}

// Used for signing the transaction via AWS KMS
// For signing with the given private key, use the web3QuorumClient
export const serializeRawTransaction = (
  options: RawTransactionOptions,
): string => {
  const GAS_PRICE = 0;
  const GAS_LIMIT = 4300000;

  const rawTransaction = {
    nonce: options.nonce,
    to: options.to,
    value: options.value || '0x0',
    gasLimit: options.gasLimit || `0x${GAS_LIMIT.toString(16)}`,
    gasPrice: options.gasPrice || `0x${GAS_PRICE.toString(16)}`,
    data: options.data,
    // isPrivate: options.isPrivate,
    // privateFrom: options.privateFrom,
    // privateFor: options.privateFor,
  };

  if (options.isPrivate) {
    rawTransaction['isPrivate'] = options.isPrivate;
    rawTransaction['privateFrom'] = options.privateFrom;
    rawTransaction['privateFor'] = options.privateFor;
  }

  return serializeTransaction(rawTransaction);
};

// Should be on a shared module? Or utils for sdk maybe
export const buildEip712Domain = (
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string,
) => {
  return {
    name,
    version,
    chainId,
    verifyingContract,
  };
};
