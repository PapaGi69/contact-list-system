import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetHealthDto } from './dto/get-health.dto';

import { writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { Payload } from '@nestjs/microservices';

@ApiTags('Healthcheck')
@Controller({ path: 'health' })
export class HealthController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHello(): Promise<GetHealthDto> {
    return { message: 'Howkey!' };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendHello(@Payload() hello: any): Promise<any> {
    console.log(hello);
    writeFileSync(`${randomUUID()}.json`, JSON.stringify(hello, null, 2));
    return { message: 'Howkey!' };
  }
}
