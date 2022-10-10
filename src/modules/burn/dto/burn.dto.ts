import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BurnDto {
  @ApiProperty({
    description:
      'The unique request id of the burn request. It will be used when sending the status of the transaction. If not passed, a request id will be generated automatically',
    required: false,
    example: 'BURN1665216684701',
  })
  @IsDefined()
  @MinLength(13) // E.g., timestamp or `${TOPUP}${timestamp}`
  @MaxLength(36) // E.g., UUID
  requestId: string;
  @ApiProperty({
    description: 'The channel id in which the wallet address is belong',
    required: true,
    example: '064a7fad-3225-466c-b915-371cd19158eb',
  })
  @IsDefined()
  @IsUUID()
  channelId: string;

  @ApiProperty({
    description: 'Address of the wallet to burn the existing tokens',
    required: true,
    example: '0x56B13820dc7b3daE14E3fc10Dcf8cEee7B02a5dE',
  })
  @IsDefined()
  @IsString()
  fromAddress: string;

  @ApiProperty({
    description:
      'The amount of tokens to be burned in the wallet address of the user',
    required: true,
    example: 100,
  })
  @IsDefined()
  @IsNumber()
  amount: number;

  // Can be an array of URLs?
  @ApiProperty({
    description:
      'The webhook url where the event or transaction updates will be delivered',
    required: true,
    example: 'https://mawbebs.free.beeceptor.com/webhook', // For security reasons, this property should validated and check/encode illegal characters in URL
  })
  @IsDefined()
  @IsString()
  @IsUrl()
  webhookURL: string;
}
