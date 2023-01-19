import { PermitController } from './permit.controller';
import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { Web3EthersModule } from 'src/providers/web3-ethers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../contract/entities/contract.entity';

@Module({
  imports: [Web3EthersModule, TypeOrmModule.forFeature([Contract])],
  controllers: [PermitController],
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
