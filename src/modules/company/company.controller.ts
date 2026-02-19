import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('company')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class CompanyController {
  @Post()
  async createCompany(): Promise<any> {}

  @Get()
  // maybe its get my company only
  // make a table for role for custom role
  async getAllCompany(): Promise<any> {
    return 'test';
  }
}
