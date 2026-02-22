import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserWithOutPassword } from '../auth/dto/userwithoutpassword.dto';

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
