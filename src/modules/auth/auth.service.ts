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

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // register as admin
  // creation of admin must be the same as creation of company
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

    return this.prismaService.$transaction(async (tx) => {
      // create company
      const newCompany = await tx.company.create({
        data: {
          companyName: company,
          description: description,
        },
      });

      // default role
      const adminRole = await tx.role.create({
        data: {
          roleName: 'Admin',
          companyId: newCompany.id,
        },
      });

      // create user
      const user = await tx.user.create({
        data: {
          username,
          email,
          password: hash,
          companyId: newCompany.id,
          roleId: adminRole.id,
        },
        select: this.userService.userSelectedFields,
      });
      return user;
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

    const tokenPayload: JwtResponseType = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(tokenPayload);
    return accessToken;
  }
}
