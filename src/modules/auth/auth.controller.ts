import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminUserDTO } from './dto/register.dto';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterAdminUserDTO,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const user = await this.authService.register(dto);
    return { message: 'Created Successfully', data: user };
  }

  @Post('login')
  async login(@Body() dto: LoginDTO): Promise<ControllerResponse<string>> {
    const accessToken = await this.authService.login(dto);
    return { message: 'Login Successfully', data: accessToken };
  }
}
