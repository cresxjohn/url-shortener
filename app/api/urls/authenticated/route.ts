import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { getAuthenticatedUser } from '@/lib/auth';
import { CreateUrlDto } from '@/lib/types';
import {
  isValidUrl,
  validateSlug,
  generateUniqueShortCode,
  checkBlacklist,
  extractTitle,
  extractDescription,
} from '@/lib/utils/url';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user (required for this endpoint)
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateUrlDto = await request.json();
    const { longUrl, customSlug, expiresAt } = body;

    // Validate URL
    if (!isValidUrl(longUrl)) {
      return NextResponse.json(
        { message: 'Invalid URL. Must start with https:// or http://' },
        { status: 400 }
      );
    }

    // Check if URL is blacklisted
    try {
      await checkBlacklist(longUrl);
    } catch (error) {
      return NextResponse.json(
        { message: 'URL is blacklisted' },
        { status: 400 }
      );
    }

    // Generate or use custom short code
    let shortCode: string;
    if (customSlug) {
      try {
        await validateSlug(customSlug);
        shortCode = customSlug;
      } catch (error) {
        return NextResponse.json(
          {
            message:
              error instanceof Error ? error.message : 'Invalid custom slug',
          },
          { status: 400 }
        );
      }
    } else {
      try {
        shortCode = await generateUniqueShortCode();
      } catch (error) {
        return NextResponse.json(
          { message: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    }

    // Extract title and description
    const title = await extractTitle(longUrl);
    const description = await extractDescription(longUrl);

    // Create URL for authenticated user
    const url = await Url.create({
      shortCode,
      longUrl,
      title,
      description,
      userId: user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json(
      {
        id: url._id.toString(),
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        title: url.title,
        description: url.description,
        customSlug: url.customSlug,
        isActive: url.isActive,
        clicks: url.clicks,
        expiresAt: url.expiresAt?.toISOString(),
        userId: url.userId?.toString(),
        createdAt: url.createdAt.toISOString(),
        updatedAt: url.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create authenticated URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
