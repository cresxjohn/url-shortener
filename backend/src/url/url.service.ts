import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUrl(createUrlDto: CreateUrlDto, userId?: string) {
    const { longUrl, customSlug, expiresAt } = createUrlDto;

    // Validate URL
    if (!this.isValidUrl(longUrl)) {
      throw new BadRequestException('Invalid URL. Must start with https://');
    }

    // Check if URL is blacklisted
    await this.checkBlacklist(longUrl);

    // Generate or use custom short code
    let shortCode: string;
    if (customSlug) {
      // Check if custom slug is available
      const existingUrl = await this.prisma.url.findUnique({
        where: { shortCode: customSlug },
      });
      if (existingUrl) {
        throw new ConflictException('Custom slug already exists');
      }
      shortCode = customSlug;
    } else {
      shortCode = await this.generateUniqueShortCode();
    }

    // Extract title and description (in a real app, you'd fetch these from the URL)
    const title = await this.extractTitle(longUrl);
    const description = await this.extractDescription(longUrl);

    return this.prisma.url.create({
      data: {
        shortCode,
        longUrl,
        title,
        description,
        userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
  }

  async getUserUrls(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [urls, total] = await Promise.all([
      this.prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.url.count({ where: { userId } }),
    ]);

    return {
      urls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUrlByShortCode(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (!url.isActive) {
      throw new NotFoundException('URL has been deactivated');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('URL has expired');
    }

    return url;
  }

  async getUrlById(id: string, userId?: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    // If userId is provided, check authorization
    if (userId && url.userId !== userId) {
      throw new ForbiddenException('You can only access your own URLs');
    }

    if (!url.isActive) {
      throw new NotFoundException('URL has been deactivated');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('URL has expired');
    }

    return url;
  }

  async updateUrl(id: string, updateUrlDto: UpdateUrlDto, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You can only update your own URLs');
    }

    // If updating longUrl, validate it
    if (updateUrlDto.longUrl && !this.isValidUrl(updateUrlDto.longUrl)) {
      throw new BadRequestException('Invalid URL. Must start with https://');
    }

    // Prepare update data
    const updateData: any = { ...updateUrlDto };

    // Only update expiresAt if it's explicitly provided
    if (updateUrlDto.expiresAt !== undefined) {
      updateData.expiresAt = updateUrlDto.expiresAt
        ? new Date(updateUrlDto.expiresAt)
        : null;
    }

    return this.prisma.url.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUrl(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You can only delete your own URLs');
    }

    await this.prisma.url.delete({
      where: { id },
    });

    return { message: 'URL deleted successfully' };
  }

  async reactivateUrl(id: string, userId: string, extensionDays = 90) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You can only reactivate your own URLs');
    }

    // Calculate new expiration date (default 90 days from now)
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + extensionDays);

    return this.prisma.url.update({
      where: { id },
      data: {
        isActive: true,
        expiresAt: newExpirationDate,
      },
    });
  }

  async incrementClick(shortCode: string) {
    return this.prisma.url.update({
      where: { shortCode },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  private async generateUniqueShortCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const shortCode = nanoid(6);
      const existingUrl = await this.prisma.url.findUnique({
        where: { shortCode },
      });

      if (!existingUrl) {
        return shortCode;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique short code');
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  }

  private async checkBlacklist(url: string): Promise<void> {
    const domain = new URL(url).hostname;
    const blacklistedUrl = await this.prisma.blacklistedUrl.findFirst({
      where: {
        OR: [{ url }, { url: domain }],
      },
    });

    if (blacklistedUrl) {
      throw new BadRequestException('URL is blacklisted');
    }
  }

  private async extractTitle(url: string): Promise<string | null> {
    // In a real implementation, you would fetch the URL and extract the title
    // For now, return null or a placeholder
    try {
      const domain = new URL(url).hostname;
      return `Page from ${domain}`;
    } catch {
      return null;
    }
  }

  private async extractDescription(url: string): Promise<string | null> {
    // In a real implementation, you would fetch the URL and extract the description
    // For now, return null
    return null;
  }
}
