import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  description: process.env.APP_DESCRIPTION,
  env: process.env.APP_ENV,
  version: process.env.APP_VERSION || '1',
  versioning: {
    enabled: process.env.APP_VERSIONING === 'true' || false,
    prefix: 'v',
  },
  http: {
    host: process.env.APP_HOST || 'localhost',
    port: Number.parseInt(process.env.APP_PORT) || 3003,
    protocol: process.env.APP_PROTOCOL,
  },
  globalPrefix: '/ate', // If no subdomain is specified, add it
  kafkaEnabled: process.env.APP_KAFKA_ENABLED === 'true' || false,
}));
