import { Logger, Injectable } from '@nestjs/common';
import { MintDto } from '../mint/dto/mint.dto';
import { BurnDto } from '../burn/dto/burn.dto';
import { TransferDto } from '../transfer/dto/transfer.dto';
import { MintService } from '../mint/mint.service';
import { BurnService } from '../burn/burn.service';
import { TransferSevice } from '../transfer/transfer.service';

const TAG = '[StablecoinService]';

@Injectable()
export class StablecoinService {
  private readonly logger = new Logger(StablecoinService.name);

  constructor(
    private readonly mintService: MintService,
    private readonly burnService: BurnService,
    private readonly transferService: TransferSevice
  ) {}

  async mint(data: MintDto): Promise<any> {
    const METHOD = '[mint]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.mintService.mint(data);
  }

  async burn(data: BurnDto): Promise<any> {
    const METHOD = '[burn]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.burnService.burn(data);
  }

  async transfer(data: TransferDto): Promise<any> {
    const METHOD = '[transfer]';
    this.logger.log(`${TAG} ${METHOD}`);

    return await this.transferService.transfer(data);
  }
}
