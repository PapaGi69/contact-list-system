import { Inject, Injectable } from '@nestjs/common';
import { WEB3_QUORUM_CLIENT } from './web3-quorum.constants';
import {
  Web3ClientError,
  Web3QuromClient,
} from './web3-quorum-client.provider';
import Web3 from 'web3';

@Injectable()
export class Web3QuorumService {
  constructor(
    @Inject(WEB3_QUORUM_CLIENT)
    private readonly web3QuromClient: Web3QuromClient,
  ) {}

  getClient(name?: string): Web3 {
    if (!name) {
      name = this.web3QuromClient.key;
    }

    if (!this.web3QuromClient.clients.has(name)) {
      throw new Web3ClientError(`Client ${name} does not exist`);
    }

    return this.web3QuromClient.clients.get(name);
  }

  getClients(): Map<string, Web3> {
    return this.web3QuromClient.clients;
  }
}
