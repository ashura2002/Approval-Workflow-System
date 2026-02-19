import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminUserDTO } from './dto/register.dto';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAsAdmin(
    @Body() dto: RegisterAdminUserDTO,
  ): Promise<{ message: string; data: UserWithOutPassword }> {
    const user = await this.authService.registerAsAdmin(dto);
    return { message: 'Created Successfully', data: user };
  }
}
