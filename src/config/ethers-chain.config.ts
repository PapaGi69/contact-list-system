import { registerAs } from '@nestjs/config';

export default registerAs('ethers-chain', () => ({
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
}));
