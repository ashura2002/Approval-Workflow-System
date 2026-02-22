import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserWithOutPassword } from '../auth/dto/userwithoutpassword.dto';
import { AuthUser } from 'src/common/types/auth.user.types';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  async getCurrentUser(@Req() req: AuthUser): Promise<UserWithOutPassword> {
    const { userId } = req.user;
    return await this.usersService.getCurrentUser(userId);
  }
}
