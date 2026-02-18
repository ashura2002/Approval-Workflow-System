import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  // register as admin
  async registerAsAdmin(dto: RegisterUserDTO) {
    const { username, email, password } = dto;
    const existingUsername =
      await this.userService.findUserByUsername(username);
    if (existingUsername)
      throw new BadRequestException('Username is already been used.');
    const existingEmail = await this.userService.findUserByEmail(email);
    if (existingEmail)
      throw new BadRequestException('Email is already been used.');

    const hash = bcrypt.hashSync(password, 10);
    return await this.prismaService.user.create({
      data: {
        ...dto,
        password: hash,
      },
      select: this.userService.userSelectedFields,
    });
  }
}
