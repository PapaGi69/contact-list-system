import { registerAs } from '@nestjs/config';
import ms from 'ms';
import bytes from 'bytes';
import { Partitioners } from 'kafkajs';

export default registerAs('kafka', () => ({
  clientId: process.env.KAFKA_CLIENT_ID || 'ate',
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'],
  consumer: {
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    sessionTimeout: ms('30s'),
    rebalanceTimeout: ms('60s'),
    heartbeatInterval: ms('5s'),
    maxBytesPerPartition: bytes('1mb'),
    maxByes: bytes('5mb'),
    maxWaitTimeInMs: ms('5s'),
    allowAutoTopicCreation: true,
    retry: {
      maxRetryTime: ms('30s'),
      initialRetryTime: ms('3s'),
      retries: 8,
    },
  },
  consumerSubscribe: {
    fromBeginning: true,
  },
  producer: {
    createPartitioner: Partitioners.DefaultPartitioner,
    transactionTimeout: ms('60s'),
    allowTopicCreation: true,
    retry: {
      maxRetryTime: ms('30s'),
      initialRetryTime: ms('3s'),
      retries: 8,
    },
    producerSend: {
      timeout: ms('30s'),
    },
  },
  admin: {
    clientId: process.env.KAFKA_ADMIN_CLIENT_ID || 'orchestrator-admin',
    defaultPartition: 3,
  },
}));
