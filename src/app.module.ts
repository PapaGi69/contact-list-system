import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import kafkaConfig from './config/kafka.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, kafkaConfig],
      envFilePath: ['.env'],
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    //   dataSourceFactory: async (options) => {
    //     const dataSource = new DataSource(options).initialize();
    //     return dataSource;
    //   },
    // }),
    HealthModule,
  ],
})
export class AppModule {}
