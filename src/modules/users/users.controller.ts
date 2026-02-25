import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateUserDTO } from './dto/updateUser.dto';
import { ControllerResponse } from 'src/common/types/controller.response.type';

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

  @Get('details/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin, Role.DepartmentHead, Role.HR)
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthUser,
  ): Promise<UserWithOutPassword> {
    const { userId } = req.user;
    return await this.usersService.findOneUserWithSameCompany(id, userId);
  }

  @Patch('details/:id')
  @Roles(Role.Admin, Role.HR)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
    @Req() req: AuthUser,
  ): Promise<ControllerResponse<UserWithOutPassword>> {
    const { userId } = req.user;
    const updatedUser = await this.usersService.updateUser(id, dto, userId);
    return { message: 'Updated Successfully', data: updatedUser };
  }

  @Delete('details/:id')
  @Roles(Role.Admin)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthUser,
  ): Promise<any> {
    const { userId } = req.user;
  }
}
