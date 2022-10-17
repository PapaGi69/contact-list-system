import { DynamicModule, Module } from '@nestjs/common';
import { AWSKMSCoreModule } from './aws-kms-core-module';
import {
  AWSKMSModuleAsyncOptions,
  AWSKMSModuleOptions,
} from './aws-kms.interface';

@Module({})
export class AWSKMSModule {
  static forRoot(options: AWSKMSModuleOptions): DynamicModule {
    return {
      module: AWSKMSModule,
      imports: [AWSKMSCoreModule.register(options)],
    };
  }

  static forRootAsync(options: AWSKMSModuleAsyncOptions): DynamicModule {
    return {
      module: AWSKMSModule,
      imports: [AWSKMSCoreModule.forRootAsync(options)],
    };
  }
}
