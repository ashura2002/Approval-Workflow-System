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
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Request, Role } from '@prisma/client';
import { CreateRequestDTO } from './dto/createRequest.dto';
import { AuthUser } from 'src/common/types/auth.user.types';
import { ControllerResponse } from 'src/common/types/controller.response.type';

@Controller('requests')
@UseGuards(JwtGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Employee)
  async CreateRequest(
    @Body() dto: CreateRequestDTO,
    @Req() req: AuthUser,
  ): Promise<ControllerResponse<Request>> {
    const { userId } = req.user;
    const leaveRequest = await this.requestsService.CreateRequest(dto, userId);
    return { message: 'Submitted Successfully', data: leaveRequest };
  }

  @Get('my-records')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Employee)
  async getAllMyRequest(@Req() req: AuthUser): Promise<Request[]> {
    const { userId } = req.user;
    return await this.requestsService.getAllMyRequest(userId);
  }

  @Patch('approved/:requestId')
  @Roles(Role.Admin, Role.DepartmentHead, Role.HR)
  @HttpCode(HttpStatus.OK)
  async approveRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() req: AuthUser,
  ): Promise<{ message: string }> {
    const { role, userId } = req.user;
    await this.requestsService.approveRequest(requestId, role as Role, userId);
    return { message: 'Approved Successfully' };
  }

  @Patch('reject/:requestId')
  @Roles(Role.Admin, Role.DepartmentHead, Role.HR)
  @HttpCode(HttpStatus.OK)
  async rejectRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() req: AuthUser,
  ): Promise<any> {
    const { role, userId } = req.user;
    return await this.requestsService.rejectRequest(
      requestId,
      userId, 
      role as Role,
    );
  }

  @Get('archive-requests')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async getAllArchiveRequests(@Req() req: AuthUser): Promise<Request[]> {
    const { userId } = req.user;
    return await this.requestsService.getAllArchiveRequests(userId);
  }

  @Get('pending-requests')
  @Roles(Role.Admin, Role.DepartmentHead, Role.HR)
  async getPendingRequest(@Req() req: AuthUser): Promise<Request[]> {
    const { role } = req.user;
    return await this.requestsService.getPendingRequest(role as Role);
  }

  @Delete(':requestId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Employee, Role.Admin)
  async deleteRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Req() req: AuthUser,
  ): Promise<any> {}

  @Get(':requestId')
  @HttpCode(HttpStatus.OK)
  async getRequestById(
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<Request> {
    return await this.requestsService.getRequestById(requestId);
  }

  // TO DO
  // UPDATE -> For approvers only
  // DELETE FOR EMPLOYEE only
}
