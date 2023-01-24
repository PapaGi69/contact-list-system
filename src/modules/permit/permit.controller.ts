import { RequestMintPermitDto } from './dto/request-mint-permit.dto';
import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { PermitService } from './permit.service';
import { InternalServerError } from 'src/filters/internal-error.filter';

const TAG = '[PermitController]';

@Controller()
@UseFilters(InternalServerError)
export class PermitController {
  private readonly logger = new Logger(PermitController.name);

  constructor(private readonly permitService: PermitService) {}

  @MessagePattern('mint.permit')
  async handleMintPermit(
    @Payload() data: RequestMintPermitDto,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const METHOD = '[handleMintPermit]';
    this.logger.log(
      `${TAG} ${METHOD} Incoming data from ${context.getTopic()}`,
    );
    return await this.permitService.requestMintPermit(data);
  }
}
