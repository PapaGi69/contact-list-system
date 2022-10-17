import { CacheModule, Module } from '@nestjs/common';
import { BurnModule } from '../burn/burn.module';
import { MintModule } from '../mint/mint.module';
import { TransferModule } from '../transfer/transfer.module';
import { StablecoinController } from './stablecoin.controller';
import { StablecoinService } from './stablecoin.service';

@Module({
  imports: [
    MintModule,
    BurnModule,
    TransferModule,
    CacheModule.registerAsync({
      useFactory: () => ({ ttl: 0, isGlobal: true }),
    }),
  ],
  controllers: [StablecoinController],
  providers: [StablecoinService],
})
export class StablecoinModule {}
