import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAdminUserDTO } from './dto/registerAdminUser.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserWithOutPassword } from './dto/userwithoutpassword.dto';
import { Role } from '@prisma/client';
import { CompanyService } from '../company/company.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { PrismaService } from '@/common/prisma.service';
import { JwtResponseType } from '@/common/types/IJwtResponse.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
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

    const existedCompany = await this.companyService.findCompanyByName(company);
    if (existedCompany)
      throw new BadRequestException(`${company} is already existed`);

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

  async registerAsEmployee(
    dto: RegisterUserDTO,
    userId: number,
  ): Promise<UserWithOutPassword> {
    return await this.register(dto, userId, Role.Employee);
  }

  async registerAsDepartmentHead(
    dto: RegisterUserDTO,
    userId: number,
  ): Promise<UserWithOutPassword> {
    return await this.register(dto, userId, Role.DepartmentHead);
  }

  async registerAsHr(
    dto: RegisterUserDTO,
    userId: number,
  ): Promise<UserWithOutPassword> {
    return await this.register(dto, userId, Role.HR);
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
      companyId: existingUser.companyId!,
    };
    const accessToken = this.jwtService.sign(tokenPayload);
    return accessToken;
  }

  async register(
    dto: RegisterUserDTO,
    userId: number,
    role: Role,
  ): Promise<UserWithOutPassword> {
    const { username, email, password } = dto;
    const currentUser = await this.userService.findUserById(userId);
    const existedUsername = await this.userService.findUserByUsername(username);
    if (existedUsername)
      throw new BadRequestException('Username is already used.');
    const existedEmail = await this.userService.findUserByEmail(email);
    if (existedEmail) throw new BadRequestException('Email already used');
    const hash = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        username,
        password: hash,
        email,
        role,
        companyId: currentUser.companyId,
      },
      select: this.userService.userSelectedFields,
    });
    return newUser;
  }
}
