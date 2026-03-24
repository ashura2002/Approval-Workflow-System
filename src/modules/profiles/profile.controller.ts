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
import { ProfileService } from './profile.service';
import { AuthUser } from 'src/common/types/auth.user.types';
import { ProfileDTO } from './dto/createProfile.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { Profile } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Req() req: AuthUser,
    @Body() dto: ProfileDTO,
  ): Promise<ControllerResponse<Profile>> {
    const { userId } = req.user;
    const profile = await this.profileService.createProfile(userId, dto);
    return { message: 'Created Successfully', data: profile };
  }

  @Get('current-profile')
  @HttpCode(HttpStatus.OK)
  async getCurrentProfile(@Req() req: AuthUser): Promise<any> {
    const { userId } = req.user;
    return await this.profileService.getCurrentProfile(userId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: AuthUser,
    @Body() dto: ProfileDTO,
  ): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.profileService.updateProfile(userId, dto);
    return { message: 'Profile Updated Successfully' };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProfile(@Req() req: AuthUser): Promise<{ message: string }> {
    const { userId } = req.user;
    await this.profileService.deleteProfile(userId);
    return { message: 'Own profile deleted successfully' };
  }
}
