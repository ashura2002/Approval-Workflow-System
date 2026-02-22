import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminUserDTO } from './dto/register.dto';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { LoginDTO } from './dto/login.dto';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerAsAdmin(
    @Body() dto: RegisterAdminUserDTO,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const user = await this.authService.registerAsAdmin(dto);
    return { message: 'Successfully Created', data: user };
  }

  @Post('login')
  async login(@Body() dto: LoginDTO): Promise<ControllerResponse<string>> {
    const accessToken = await this.authService.login(dto);
    return { message: 'Login Successfully', data: accessToken };
  }
}
