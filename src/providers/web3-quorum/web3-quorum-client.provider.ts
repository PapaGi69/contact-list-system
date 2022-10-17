import Web3 from 'web3';
import Web3Quorum from 'web3js-quorum';
import {
  Web3QuorumModuleAsyncOptions,
  Web3QuorumModuleOptions,
} from './web3-quorum.interface';
import {
  WEB3_QUORUM_CLIENT,
  WEB3_QUORUM_MODULE_OPTIONS,
} from './web3-quorum.constants';
import { Provider } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class Web3ClientError extends Error {}
export interface Web3QuromClient {
  key: string;
  clients: Map<string, Web3>;
}

export const getClient = async (
  options: Web3QuorumModuleOptions,
): Promise<Web3> => {
  const { url, privateUrl } = options;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // ipcPath and tlsSettings are not configured here
  // TODO: Implementing the security protocol
  // Set the authorization header for connecting to RPC nodes aside from node api keys
  return new Web3Quorum(new Web3(url), { privateUrl }, /* isQuorum => */ true);
};

export const createClient = (): Provider => ({
  provide: WEB3_QUORUM_CLIENT,
  useFactory: async (
    options: Web3QuorumModuleOptions | Web3QuorumModuleOptions[],
  ): Promise<Web3QuromClient> => {
    const clients = new Map<string, Web3>();
    const defaultKey = randomUUID();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async (opt) => {
          const key = opt.name || defaultKey;
          if (clients.has(key)) {
            throw new Web3ClientError(`Web3 client ${key} already exists`);
          }

          clients.set(key, await getClient(opt));
        }),
      );
    } else {
      const key = options.name || defaultKey;
      clients.set(key, await getClient(options));
    }

    return {
      key: defaultKey,
      clients,
    };
  },
  inject: [WEB3_QUORUM_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (
  options: Web3QuorumModuleAsyncOptions,
) => ({
  provide: WEB3_QUORUM_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
