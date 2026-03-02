import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateRequestDTO } from './dto/createRequest.dto';
import { Request, RequestStatus, Role } from '@prisma/client';
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
    role: Role,
    userId: number,
  ): Promise<void> {
    const currentUser = await this.userService.findUserById(userId);
    const request = await this.getRequestById(requestId);
    const requester = await this.userService.findUserById(request.userId);
    if (currentUser.companyId !== requester.companyId)
      throw new ForbiddenException(
        'You can only decide leave request on your company',
      );

    if (request.status !== RequestStatus.Pending)
      throw new BadRequestException('Request is no longer pending');
    if (request.viewTo !== role)
      throw new ForbiddenException(
        'You are not authorized to approve this request',
      );

    let nextViewTo: Role;
    if (role === Role.DepartmentHead) {
      nextViewTo = Role.HR;
    } else if (role === Role.HR) {
      nextViewTo = Role.Admin;
    }

    await this.prismaService.request.update({
      where: { id: request.id },
      data: {
        viewTo: nextViewTo,
        status:
          nextViewTo === null ? RequestStatus.Approved : RequestStatus.Pending,
      },
    });
    // fix viewTo after admin it gives error if null
  }

  async rejectRequest(): Promise<any> {}

  async getPendingRequest(role: Role): Promise<Request[]> {
    const pendingRequest = await this.prismaService.request.findMany({
      where: {
        status: RequestStatus.Pending,
        viewTo: role,
      },
    });
    return pendingRequest;
  }
}
