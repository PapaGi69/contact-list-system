import { registerAs } from '@nestjs/config';

export default registerAs('ethers-chain', () => ({
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
  addresses: {
    artifract: process.env.ARTIFRACT_CONTRACT_ADDRESS,
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
