import { ContractService } from './contract.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractController } from './contract.controller';

@Module({
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
  imports: [TypeOrmModule.forFeature([Contract])],
})
export class ContractModule {}
