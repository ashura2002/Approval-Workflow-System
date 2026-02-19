import { PrismaService } from 'src/common/prisma.service';

export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}
}
