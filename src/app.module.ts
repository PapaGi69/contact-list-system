import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import kafkaConfig from './config/kafka.config';
import transactionNodeServiceConfig from './config/transaction-node.service.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HealthModule } from './modules/health/health.module';
import { BurnModule } from './modules/burn/burn.module';
import { MintModule } from './modules/mint/mint.module';
import { Web3QuorumModule } from './providers/web3-quorum';
import { TransferModule } from './modules/transfer/transfer.module';
import { StablecoinModule } from './modules/stablecoin/stablecoin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, kafkaConfig, transactionNodeServiceConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options).initialize();
        return dataSource;
      },
    }),
    Web3QuorumModule.forRoot({
      name: '',
      url: '',
      privateUrl: '',
    }),
    HealthModule,
    MintModule,
    BurnModule,
    TransferModule,
    StablecoinModule,
  ],
})
export class AppModule {}
