import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  roleId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  @IsInt()
  profileId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  companyId: number;
}
