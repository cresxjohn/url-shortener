import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteAccount(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user and all associated data (URLs and clicks)
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Account deleted successfully' };
  }

  async getUserStats(id: string) {
    const [urlCount, totalClicks] = await Promise.all([
      this.prisma.url.count({
        where: { userId: id },
      }),
      this.prisma.url.aggregate({
        where: { userId: id },
        _sum: {
          clicks: true,
        },
      }),
    ]);

    return {
      urlCount,
      totalClicks: totalClicks._sum.clicks || 0,
    };
  }
}
