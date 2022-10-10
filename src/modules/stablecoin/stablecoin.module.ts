import { Module } from '@nestjs/common';
import { BurnService } from '../burn/burn.service';
import { MintService } from '../mint/mint.service';
import { TransferSevice } from '../transfer/transfer.service';
import { StablecoinController } from './stablecoin.controller';
import { StablecoinService } from './stablecoin.service';

@Module({
  controllers: [StablecoinController],
  providers: [
    StablecoinService,
    MintService,
    BurnService,
    TransferSevice
  ],
})
export class StablecoinModule {}
