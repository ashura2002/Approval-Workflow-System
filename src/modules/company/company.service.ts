import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
