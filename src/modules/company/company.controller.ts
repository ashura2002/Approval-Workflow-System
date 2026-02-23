import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AuthUser } from 'src/common/types/auth.user.types';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';

@Controller('company')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(): Promise<any> {}

  @Get()
  async getAllCompany(@Req() req: AuthUser): Promise<Company> {
    const { companyId } = req.user;
    return await this.companyService.getOwnCompany(companyId);
  }
}
