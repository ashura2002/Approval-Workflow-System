import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateRequestDTO } from './dto/createRequest.dto';
import { Request, Role } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
