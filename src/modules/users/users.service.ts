import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findUserById(id: number): Promise<UserWithOutPassword> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: this.userSelectedFields,
    });
  }

  async findOneUserWithSameCompany(
    userId: number,
    currentUserId: number,
  ): Promise<any> {
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
