import { registerAs } from '@nestjs/config';

// thid-party service configurations go here
export default registerAs('qbs-node-service', () => ({
  transactionNode: {
    name: 'transaction-node',
    url: process.env.QBS_TRANSACTION_NODE_URL,
    privateUrl: process.env.QBS_TRANSACTION_MANAGER_URL
  }
}));
