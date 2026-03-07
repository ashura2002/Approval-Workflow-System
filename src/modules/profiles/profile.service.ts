import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ProfileDTO } from './dto/createProfile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProfile(userId: number, dto: ProfileDTO): Promise<Profile> {
    const existingProfile = await this.getProfileById(userId);

    if (existingProfile)
      throw new BadRequestException('You already created your profile');

    const profile = await this.prismaService.profile.create({
      data: { ...dto, userId },
    });
    return profile;
  }

  async getProfileById(userId: number): Promise<Profile | null> {
    const existingProfile = await this.prismaService.profile.findUnique({
      where: { userId },
    });
    return existingProfile;
  }

  async getCurrentProfile(userId: number): Promise<Profile> {
    const profile = await this.getProfileById(userId);
    if (!profile)
      throw new NotFoundException(
        'Profile not found, Create Profile your profile first',
      );
    return profile;
  }

  async updateProfile(userId: number, dto: ProfileDTO): Promise<void> {
    const currentUser = await this.getProfileById(userId);
    if (!currentUser) throw new NotFoundException('Profile not found');
    await this.prismaService.profile.update({
      where: { id: currentUser.id },
      data: { ...dto },
    });
  }

  async deleteProfile(userId: number): Promise<void> {
    const profile = await this.getProfileById(userId);
    if (!profile)
      throw new BadRequestException('Profile is already deleted, Not Found');
    await this.prismaService.profile.delete({
      where: { id: profile.id },
    });
  }
}
