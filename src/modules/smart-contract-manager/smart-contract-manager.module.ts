import { Module } from '@nestjs/common';
import { SmartContractManagerService } from './smart-contract-manager.service';

@Module({
  providers: [SmartContractManagerService],
  exports: [SmartContractManagerService],
})
export class SmartContractModule {}
