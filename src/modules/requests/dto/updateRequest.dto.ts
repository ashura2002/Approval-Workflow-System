import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRequestDTO {
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
