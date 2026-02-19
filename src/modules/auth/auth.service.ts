import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterAdminUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtResponse } from 'src/common/types/IJwtResponse.type';
import { ControllerResponse } from 'src/common/types/controller.response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // register as admin
  async register(dto: RegisterAdminUserDTO) {
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
        role: Role.Admin,
      },
      select: this.userService.userSelectedFields,
    });
  }

  async login(dto: LoginDTO): Promise<string> {
    const { username, password } = dto;
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('Invalid credentials');

    const tokenPayload: IJwtResponse = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(tokenPayload);
    return accessToken;
  }
}
