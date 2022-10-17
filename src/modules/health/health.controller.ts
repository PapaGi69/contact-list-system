import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetHealthDto } from './dto/get-health.dto';

@ApiTags('Healthcheck')
@Controller({ path: 'health' })
export class HealthController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHello(): Promise<GetHealthDto> {
    return { message: 'Howkey!' };
  }
}
