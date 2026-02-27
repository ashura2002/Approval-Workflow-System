import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
  exports: [RequestsService],
})
export class RequestsModule {}
// todo
// request modules
// FOR THE APPROVERS -> if users want to get all request it will filter by there companyId to ensure that they get there own data
// approval workflow
