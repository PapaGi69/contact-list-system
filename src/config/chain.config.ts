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
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
  addresses: {
    artifract: process.env.ARTIFRACT_CONTRACT_ADDRESS,
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
  smartContract: {
    domainName: process.env.SMART_CONTRACT_DOMAIN_NAME,
    smartContractAddress: process.env.SMART_CONTRACT_ADDRESS,
    rpcProvider: process.env.SMART_CONTRACT_PROVIDER,
    revision: process.env.SMART_CONTRACT_REVISION,
    contractDeployer: process.env.SMART_CONTRACT_DEPLOYER,
    deployerPublicKey: process.env.SMART_CONTRACT_DEPLOYER_KEY,
    tokenType: process.env.NFT_TOKEN_TYPE,
    tokenName: process.env.NFT_TOKEN_NAME,
    blockchainExplorer: process.env.BLOCKCHAIN_EXPLORER_URL,
    platformFeePercentage: process.env.PLATFORM_FEE_PERCENTAGE,
  },
}));
