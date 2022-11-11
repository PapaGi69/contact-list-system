import { PermitController } from './permit.controller';
import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';

@Module({
  controllers: [PermitController],
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
