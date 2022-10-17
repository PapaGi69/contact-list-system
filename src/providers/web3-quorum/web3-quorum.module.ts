import {
  Web3QuorumModuleAsyncOptions,
  Web3QuorumModuleOptions,
} from './web3-quorum.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { Web3QuorumCoreModule } from './web3-quorum-core.module';

@Module({})
export class Web3QuorumModule {
  static forRoot(
    options: Web3QuorumModuleOptions | Web3QuorumModuleOptions[],
  ): DynamicModule {
    return {
      module: Web3QuorumModule,
      imports: [Web3QuorumCoreModule.register(options)],
    };
  }

  static forRootAsync(options: Web3QuorumModuleAsyncOptions): DynamicModule {
    return {
      module: Web3QuorumModule,
      imports: [Web3QuorumCoreModule.forRootAsync(options)],
    };
  }
}
