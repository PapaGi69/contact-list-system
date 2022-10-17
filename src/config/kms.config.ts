import { registerAs } from '@nestjs/config';

export default registerAs('kms', () => ({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_DEFAULT_REGION,
  apiVersion: '2014-11-01',
}));
