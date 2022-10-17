import { Module } from '@nestjs/common';
import { BurnService } from './burn.service';

@Module({
  providers: [BurnService],
  exports: [BurnService],
})
export class BurnModule {}
