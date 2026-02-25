import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserWithOutPassword } from '../auth/dto/userwithoutpassword.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUsername(
    username: string,
  ): Promise<UserWithOutPassword | null> {
    const user = await this.prismaService.user.findFirst({
      where: { username },
      select: this.userSelectedFields,
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<UserWithOutPassword | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findUserById(id: number): Promise<UserWithOutPassword> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: this.userSelectedFields,
    });
  }

  async findOneUserWithSameCompany(
    userId: number,
    currentUserId: number,
  ): Promise<UserWithOutPassword> {
    const currentUser = await this.prismaService.user.findUnique({
      where: { id: currentUserId },
      select: this.userSelectedFields,
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: this.userSelectedFields,
    });
    if (!currentUser || !user) throw new NotFoundException('User not found');

    if (user.companyId !== currentUser.companyId)
      throw new BadRequestException(
        'You can only see employee on your own company',
      );
    return user;
  }

  async getAllusersOnOwnCompany(
    companyId: number,
  ): Promise<UserWithOutPassword[]> {
    return await this.prismaService.user.findMany({
      where: { companyId },
      select: this.userSelectedFields,
    });
  }

  async getCurrentUser(userId: number): Promise<UserWithOutPassword> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: this.userSelectedFields,
    });
  }

  async getUserById(userId: number): Promise<UserWithOutPassword> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: this.userSelectedFields,
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async updateUser(
    id: number,
    dto: UpdateUserDTO,
    userId: number,
  ): Promise<UserWithOutPassword> {
    const { password } = dto;
    await this.findOneUserWithSameCompany(id, userId);
    const hash = await bcrypt.hash(password, 10);
    const updatedUser = await this.prismaService.user.update({
      where: { id: id },
      data: { ...dto, password: hash },
      select: this.userSelectedFields,
    });

    return updatedUser;
  }

  async deleteUser(userId: number, currentUserId: number): Promise<void> {
    const user = await this.findOneUserWithSameCompany(userId, currentUserId);
    await this.prismaService.user.delete({
      where: { id: user.id },
    });
  }

  // getter function
  get userSelectedFields() {
    return {
      id: true,
      username: true,
      email: true,
      role: true,
      companyId: true,
    };
  }
}
