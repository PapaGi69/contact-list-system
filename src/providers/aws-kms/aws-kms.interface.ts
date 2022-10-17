import { ModuleMetadata } from '@nestjs/common';
import { KMSClient } from '@aws-sdk/client-kms';

export interface AWSKMSModuleOptions {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  apiVersion: string;
}

export interface AWSKMSModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => AWSKMSModuleOptions;
  inject?: any[];
}

export type AWSKMSClient = KMSClient;
