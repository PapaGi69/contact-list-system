import { ModuleMetadata } from '@nestjs/common';

export interface Web3QuorumModuleOptions {
  name?: string;
  url: string;
  privateUrl: string;
}

export interface Web3QuorumModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | Web3QuorumModuleOptions
    | Web3QuorumModuleOptions[]
    | Promise<Web3QuorumModuleOptions>
    | Promise<Web3QuorumModuleOptions[]>;
  inject?: any[];
}
