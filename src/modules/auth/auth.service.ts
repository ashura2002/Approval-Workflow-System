import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterAdminUserDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtResponseType } from 'src/common/types/IJwtResponse.type';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerAsAdmin(
    dto: RegisterAdminUserDTO,
  ): Promise<UserWithOutPassword> {
    const { username, email, password, company, description } = dto;
    const existedUsername = await this.userService.findUserByUsername(username);
    if (existedUsername)
      throw new BadRequestException(`${username} is already taken. Try again`);
    const existedEmail = await this.userService.findUserByEmail(email);
    if (existedEmail) throw new BadRequestException('Email already used.');
    const hash = await bcrypt.hash(password, 10);

    return await this.prismaService.$transaction(async (tx) => {
      // create company when creating admin user
      const newCompany = await tx.company.create({
        data: {
          companyName: company,
          description: description,
        },
      });

      // creating user
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          password: hash,
          role: Role.Admin,
          companyId: newCompany.id,
        },
        select: this.userService.userSelectedFields,
      });
      return newUser;
    });
  }

  async login(dto: LoginDTO): Promise<string> {
    const { username, password } = dto;
    const existingUser = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!existingUser) throw new BadRequestException('User not found');
    const isHash = await bcrypt.compare(password, existingUser.password);
    if (!isHash) throw new BadRequestException('Invalid Credentials');

    const tokenPayload: JwtResponseType = {
      userId: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role,
      companyId: existingUser.companyId,
    };
    const accessToken = this.jwtService.sign(tokenPayload);
    return accessToken;
  }
}
