import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateRequestDTO } from './dto/createRequest.dto';
import { Request, Role } from '@prisma/client';
import { UpdateRequestDTO } from './dto/updateRequest.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async CreateRequest(dto: CreateRequestDTO, userId: number): Promise<Request> {
    // need to check first if the current user sending a request is has an request on that sched he/she fill up
    const { startDate, endDate } = dto;
    if (startDate >= endDate)
      throw new BadRequestException('Start date must be lower than end date');

    const newRequest = await this.prismaService.request.create({
      data: { ...dto, viewTo: Role.DepartmentHead, userId },
    });
    return newRequest;
  }

  async getAllMyRequest(userId: number): Promise<Request[]> {
    return await this.prismaService.request.findMany({
      where: { userId },
    });
  }

  async getRequestById(requestId: number): Promise<Request> {
    const request = await this.prismaService.request.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async approveRequest(
    requestId: number,
    userId: number,
    dto: UpdateRequestDTO,
  ): Promise<any> {
    const approver = await this.userService.getUserById(userId);
    console.log(approver);
  }

  // fix this service make it readable
  async getPendingRequest(role: Role): Promise<any> {
    let condition: any = {};

    if (role === 'DepartmentHead') {
      condition = { viewTo: Role.DepartmentHead };
    }

    if (role === 'HR') {
      condition = { viewTo: Role.HR };
    }

    if (role === 'Admin') {
      condition = { viewTo: Role.Admin };
    }

    const pendingRequests = await this.prismaService.request.findMany({
      where: condition,
    });

    return pendingRequests;
  }
}
