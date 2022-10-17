import { KMSClient } from '@aws-sdk/client-kms';
import {
  AWSKMSModuleAsyncOptions,
  AWSKMSModuleOptions,
  AWSKMSClient,
} from './aws-kms.interface';
import { AWS_KMS_CLIENT, AWS_KMS_MODULE_OPTIONS } from './aws-kms.constants';
import { Provider } from '@nestjs/common';

export class AWSKMSClientError extends Error {}

export const getClient = async (
  options: AWSKMSModuleOptions,
): Promise<AWSKMSClient> => {
  return new KMSClient(options);
};

export const createClient = (): Provider => ({
  provide: AWS_KMS_CLIENT,
  useFactory: async (options: AWSKMSModuleOptions): Promise<KMSClient> => {
    return await getClient(options);
  },
  inject: [AWS_KMS_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (
  options: AWSKMSModuleAsyncOptions,
) => ({
  provide: AWS_KMS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
