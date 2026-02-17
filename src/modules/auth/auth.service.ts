import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { RegisterUserDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  register(dto: RegisterUserDTO) {
    return dto;
  }
}
