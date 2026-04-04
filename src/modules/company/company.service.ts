import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { UpdateCompanyDTO } from './dto/updateCompany.dto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '@/common/prisma.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async findCompanyByName(companyName: string): Promise<Company | null> {
    const company = await this.prismaService.company.findUnique({
      where: { companyName: companyName },
    });
    return company;
  }

  async getOwnCompany(companyId: number): Promise<Company> {
    return await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
  }

  async updateCompany(
    companyId: number,
    userId: number,
    dto: UpdateCompanyDTO,
  ): Promise<any> {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const user = await this.userService.findUserById(userId);
    if (company.id !== user.companyId)
      throw new BadRequestException('You can only update your own company.');

    const updatedCompany = await this.prismaService.company.update({
      where: { id: company.id },
      data: { ...dto },
    });
    return updatedCompany;
  }

  async deleteOwnCompany(
    companyId: number,
    currentUserId: number,
  ): Promise<void> {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const user = await this.userService.findUserById(currentUserId);
    if (company.id !== user.companyId)
      throw new BadRequestException('You can only delete your own company.');
    await this.prismaService.company.delete({ where: { id: company.id } });
  }
}
