import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
}
