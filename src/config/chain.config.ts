import { registerAs } from '@nestjs/config';

// thid-party service configurations go here
export default registerAs('chain', () => ({
  transactionNode: {
    name: 'transactionNode',
    url: process.env.QBS_TRANSACTION_NODE_URL,
    privateUrl: process.env.QBS_TRANSACTION_MANAGER_URL,
    chainId: 10,
    eip712Version: '1',
    eip712DomainName: 'PHX',
  },
  addresses: {
    phxContract: process.env.PHX_CONTRACT_ADDRESS,
    adminMinter: process.env.ADMIN_MINTER_KMS_ID,
    adminBurner: process.env.ADMIN_BURNER_KMS_ID,
    adminTransferer: process.env.ADMIN_TRANSFERER_KMS_ID,
  },
  eip712: {
    chainId: 10,
    version: '1',
    domainName: 'PHX',
  },
}));
