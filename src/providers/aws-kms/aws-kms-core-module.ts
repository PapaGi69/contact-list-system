import { DynamicModule, Global, Inject, Module } from '@nestjs/common';
import {
  AWSKMSModuleAsyncOptions,
  AWSKMSModuleOptions,
} from './aws-kms.interface';
import { AWS_KMS_CLIENT, AWS_KMS_MODULE_OPTIONS } from './aws-kms.constants';
import {
  createAsyncClientOptions,
  createClient,
} from './aws-kms-client.provider';
import { AWSKMSService } from './aws-kms.service';

@Global()
@Module({ providers: [AWSKMSService], exports: [AWSKMSService] })
export class AWSKMSCoreModule {
  static register(options: AWSKMSModuleOptions): DynamicModule {
    return {
      module: AWSKMSCoreModule,
      providers: [
        createClient(),
        { provide: AWS_KMS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [AWSKMSService],
    };
  }

  static forRootAsync(options: AWSKMSModuleAsyncOptions): DynamicModule {
    return {
      module: AWSKMSCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [AWSKMSService],
    };
  }
}
