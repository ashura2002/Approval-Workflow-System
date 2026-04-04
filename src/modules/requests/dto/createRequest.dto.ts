import { ApiProperty } from '@nestjs/swagger';
import { LeaveType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LeaveType)
  leaveType!: LeaveType;
}
