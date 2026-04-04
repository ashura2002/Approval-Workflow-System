import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  username!: string;

  @IsNotEmpty()
  @ApiProperty()
  password!: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email!: string;
}
