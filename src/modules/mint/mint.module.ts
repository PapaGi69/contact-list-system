import { Module } from '@nestjs/common';
import { MintService } from './mint.service';

@Module({
  providers: [MintService],
  exports: [MintService],
})
export class MintModule {}
