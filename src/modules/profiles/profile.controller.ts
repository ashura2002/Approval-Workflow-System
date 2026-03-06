import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthUser } from 'src/common/types/auth.user.types';
import { CreateProfileDTO } from './dto/createProfile.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { ControllerResponse } from 'src/common/types/controller.response.type';
import { Profile } from '@prisma/client';

@Controller('profile')
@UseGuards(JwtGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Req() req: AuthUser,
    @Body() dto: CreateProfileDTO,
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
}
