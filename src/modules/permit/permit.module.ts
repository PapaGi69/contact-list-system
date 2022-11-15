import { PermitController } from './permit.controller';
import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { Web3EthersModule } from 'src/providers/web3-ethers';

@Module({
  imports: [Web3EthersModule],
  controllers: [PermitController],
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
