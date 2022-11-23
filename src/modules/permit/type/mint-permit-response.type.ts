import { MintPermitType } from './mint-permit.type';

export type MintPermitResponseType = {
  types: {
    MintPermit: MintPermitType;
  };
  domain: MintDomain;
  message: MintMessage;
};

type MintDomain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
};

type MintMessage = {
  purchaser: string;
  seller: string;
  deadline: string;
};
