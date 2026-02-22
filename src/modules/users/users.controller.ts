import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserWithOutPassword } from '../auth/dto/userwithoutpassword.dto';
import { AuthUser } from 'src/common/types/auth.user.types';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: AuthUser): Promise<UserWithOutPassword> {
    const { userId } = req.user;
    return await this.usersService.getCurrentUser(userId);
  }

  @Get('own-company')
  @HttpCode(HttpStatus.OK)
  async getAllUsersOnOwnCompany(
    @Req() req: AuthUser,
  ): Promise<UserWithOutPassword[]> {
    const { companyId } = req.user;
    return this.usersService.getAllusersOnOwnCompany(companyId);
  }
}
