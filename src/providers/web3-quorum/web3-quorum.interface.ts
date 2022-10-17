import { ModuleMetadata } from '@nestjs/common';

export interface Web3QuorumModuleOptions {
  name?: string; // Can set the node details via channel name
  key?: string; // Can set the node details via channel uuid
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
