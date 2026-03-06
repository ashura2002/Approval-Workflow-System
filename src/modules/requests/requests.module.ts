import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
  exports: [RequestsService],
})
export class RequestsModule {}
