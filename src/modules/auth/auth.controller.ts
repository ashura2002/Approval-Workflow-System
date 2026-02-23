import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { LoginDTO } from './dto/login.dto';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role.decorator';
import { RegisterAdminUserDTO } from './dto/registerAdminUser.dto';
import { AuthUser } from 'src/common/types/auth.user.types';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RegisterUserDTO } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerAsAdmin(
    @Body() dto: RegisterAdminUserDTO,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const user = await this.authService.registerAsAdmin(dto);
    return { message: 'Created Successfully', data: user };
  }

  @Post('register-employee')
  @UseGuards(JwtGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async registerAsEmployee(
    @Body() dto: RegisterUserDTO,
    @Req() req: AuthUser,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const { userId } = req.user;
    const user = await this.authService.registerAsEmployee(dto, userId);
    return { message: 'Created Successfully', data: user };
  }

  @Post('register-departmentHead')
  @UseGuards(JwtGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async registerAsDepartmentHead(
    @Body() dto: RegisterUserDTO,
    @Req() req: AuthUser,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const { userId } = req.user;
    const user = await this.authService.registerAsDepartmentHead(dto, userId);
    return { message: 'Created Successfully', data: user };
  }

  // endpoints for creating HR
  @Post('register-hr')
  @UseGuards(JwtGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async registerAsHr(
    @Body() dto: RegisterUserDTO,
    @Req() req: AuthUser,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const { userId } = req.user;
    const user = await this.authService.registerAsHr(dto, userId);
    return { message: 'Created Successfully', data: user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO): Promise<ControllerResponse<string>> {
    const accessToken = await this.authService.login(dto);
    return { message: 'Login Successfully', data: accessToken };
  }
}
