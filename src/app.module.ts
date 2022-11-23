import { PermitModule } from './modules/permit/permit.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import kafkaConfig from './config/kafka.config';
import chainConfig from './config/chain.config';
import kmsConfig from './config/kms.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HealthModule } from './modules/health/health.module';
import { BurnModule } from './modules/burn/burn.module';
import { MintModule } from './modules/mint/mint.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { StablecoinModule } from './modules/stablecoin/stablecoin.module';
import { TransactionModule } from './modules/transaction/transaction.module';

import { Web3QuorumModule } from './providers/web3-quorum';
import { AWSKMSModule } from './providers/aws-kms';
import { Web3EthersModule } from './providers/web3-ethers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, kafkaConfig, chainConfig, kmsConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options).initialize();
        return dataSource;
      },
    }),
    // Should load all channel tables or dynamo db table
    // with channel id/name tied to a quorum node urls
    Web3QuorumModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('chain.transactionNode'),
      inject: [ConfigService],
    }),
    // Separate AWS KMS Credentials
    AWSKMSModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('kms'),
      inject: [ConfigService],
    }),
    Web3EthersModule,
    HealthModule,
    MintModule,
    BurnModule,
    TransferModule,
    StablecoinModule,
    TransactionModule,
    PermitModule,
  ],
})
export class AppModule {}
