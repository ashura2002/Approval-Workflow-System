import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AuthUser } from 'src/common/types/auth.user.types';
import { CompanyService } from './company.service';
import { Company, Role } from '@prisma/client';
import { UpdateCompanyDTO } from './dto/updateCompany.dto';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ControllerResponse } from 'src/common/types/controller.response.type';

@Controller('company')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCompany(@Req() req: AuthUser): Promise<Company> {
    const { companyId } = req.user;
    return await this.companyService.getOwnCompany(companyId);
  }

  @Patch(':companyId')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async updateCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Req() req: AuthUser,
    @Body() dto: UpdateCompanyDTO,
  ): Promise<ControllerResponse<Company>> {
    const { userId } = req.user;
    const updatedCompany = await this.companyService.updateCompany(
      companyId,
      userId,
      dto,
    );
    return { message: 'Updated Successfully', data: updatedCompany };
  }

  @Delete(':companyId')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async deleteOwnCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Req() req: AuthUser,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.companyService.deleteOwnCompany(companyId, userId);
    return { message: 'Company deleted successfully.' };
  }
}
