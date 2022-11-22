import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { EthersModule } from 'nestjs-ethers';

import { Web3EthersService } from './web3-ethers.service';

@Module({
  imports: [
    EthersModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          network: configService.get('chain.smartContract.network'),
          infura: configService.get('chain.infura'),
          useDefaultProvider: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [Web3EthersService],
  exports: [Web3EthersService],
})
export class Web3EthersModule {}
