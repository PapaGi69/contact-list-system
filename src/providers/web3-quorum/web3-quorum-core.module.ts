import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  Web3QuorumModuleAsyncOptions,
  Web3QuorumModuleOptions,
} from './web3-quorum.interface';
import {
  WEB3_QUORUM_CLIENT,
  WEB3_QUORUM_MODULE_OPTIONS,
} from './web3-quorum.constants';
import {
  createAsyncClientOptions,
  createClient,
  Web3QuromClient,
} from './web3-quorum-client.provider';
import { HttpProviderBase } from 'web3-core-helpers';
import { Web3QuorumService } from './web3-quorum.service';

@Global()
@Module({ providers: [Web3QuorumService], exports: [Web3QuorumService] })
export class Web3QuorumCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(WEB3_QUORUM_MODULE_OPTIONS)
    private readonly options:
      | Web3QuorumModuleOptions
      | Web3QuorumModuleOptions[],
    @Inject(WEB3_QUORUM_CLIENT)
    private readonly web3QuromClient: Web3QuromClient,
  ) {}

  static register(
    options: Web3QuorumModuleOptions | Web3QuorumModuleOptions[],
  ): DynamicModule {
    return {
      module: Web3QuorumCoreModule,
      providers: [
        createClient(),
        { provide: WEB3_QUORUM_MODULE_OPTIONS, useValue: options },
      ],
      exports: [Web3QuorumService],
    };
  }

  static forRootAsync(options: Web3QuorumModuleAsyncOptions): DynamicModule {
    return {
      module: Web3QuorumCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [Web3QuorumService],
    };
  }

  onModuleDestroy(): void {
    const closeConnection =
      ({ clients, key }: Web3QuromClient) =>
      (options: Web3QuorumModuleOptions) => {
        const name = options.name || key;
        const client = clients.get(name);

        if (client) {
          const provider = client.currentProvider as HttpProviderBase;
          provider.disconnect();
        }
      };

    const closeClientConnection = closeConnection(this.web3QuromClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
