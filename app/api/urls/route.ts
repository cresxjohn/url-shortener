import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { getAuthenticatedUser, extractTokenFromRequest } from '@/lib/auth';
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

    // Check if user is authenticated (optional for this endpoint)
    let userId = null;
    const token = extractTokenFromRequest(request);
    if (token) {
      try {
        const user = getAuthenticatedUser(request);
        userId = user.id;
      } catch (error) {
        // Token invalid, continue as anonymous
      }
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

    // Create URL
    const url = await Url.create({
      shortCode,
      longUrl,
      title,
      description,
      userId,
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
    console.error('Create URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user URLs with pagination
    const [urls, total] = await Promise.all([
      Url.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Url.countDocuments({ userId: user.id }),
    ]);

    return NextResponse.json({
      urls: urls.map((url: any) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
