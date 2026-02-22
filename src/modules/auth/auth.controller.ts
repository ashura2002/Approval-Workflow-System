import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { LoginDTO } from './dto/login.dto';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { AuthUser } from 'src/common/types/auth.user.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerAsAdmin(
    @Body() dto: RegisterUserDTO,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const user = await this.authService.registerAsAdmin(dto);
    return { message: 'Successfully Created', data: user };
  }

  @Post('regiter-user')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() dto: RegisterUserDTO, @Req() userId: AuthUser): Promise<any> {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO): Promise<ControllerResponse<string>> {
    const accessToken = await this.authService.login(dto);
    return { message: 'Login Successfully', data: accessToken };
  }
}
