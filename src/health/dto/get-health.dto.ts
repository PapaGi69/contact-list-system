import { ApiProperty } from '@nestjs/swagger';

export class GetHealthDto {
  @ApiProperty({ description: 'Sample hello message', example: 'Howkey!' })
  message: string;
}
