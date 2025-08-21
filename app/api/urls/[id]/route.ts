import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { getAuthenticatedUser } from '@/lib/auth';
import { UpdateUrlDto } from '@/lib/types';
import { isValidUrl } from '@/lib/utils/url';

interface Context {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // In Next.js 14+, params is a Promise
    const resolvedParams = await params;
    
    // Find URL
    const url = await Url.findById(resolvedParams.id);
    if (!url) {
      return NextResponse.json({ message: 'URL not found' }, { status: 404 });
    }

    // Check authorization
    if (url.userId?.toString() !== user.id) {
      return NextResponse.json(
        { message: 'You can only access your own URLs' },
        { status: 403 }
      );
    }

    // Check if URL is active
    if (!url.isActive) {
      return NextResponse.json(
        { message: 'URL has been deactivated' },
        { status: 404 }
      );
    }

    // Check if URL has expired
    if (url.expiresAt && url.expiresAt < new Date()) {
      return NextResponse.json({ message: 'URL has expired' }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Get URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // In Next.js 14+, params is a Promise
    const resolvedParams = await params;
    
    // Find URL
    const url = await Url.findById(resolvedParams.id);
    if (!url) {
      return NextResponse.json({ message: 'URL not found' }, { status: 404 });
    }

    // Check authorization
    if (url.userId?.toString() !== user.id) {
      return NextResponse.json(
        { message: 'You can only update your own URLs' },
        { status: 403 }
      );
    }

    const body: UpdateUrlDto = await request.json();

    // Validate longUrl if provided
    if (body.longUrl && !isValidUrl(body.longUrl)) {
      return NextResponse.json(
        { message: 'Invalid URL. Must start with https:// or http://' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = { ...body };

    // Handle expiresAt field
    if (body.expiresAt !== undefined) {
      updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }

    // Update URL
    const updatedUrl = await Url.findByIdAndUpdate(resolvedParams.id, updateData, {
      new: true,
    });

    return NextResponse.json({
      id: updatedUrl!._id.toString(),
      shortCode: updatedUrl!.shortCode,
      longUrl: updatedUrl!.longUrl,
      title: updatedUrl!.title,
      description: updatedUrl!.description,
      customSlug: updatedUrl!.customSlug,
      isActive: updatedUrl!.isActive,
      clicks: updatedUrl!.clicks,
      expiresAt: updatedUrl!.expiresAt?.toISOString(),
      userId: updatedUrl!.userId?.toString(),
      createdAt: updatedUrl!.createdAt.toISOString(),
      updatedAt: updatedUrl!.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // In Next.js 14+, params is a Promise
    const resolvedParams = await params;
    
    // Find URL
    const url = await Url.findById(resolvedParams.id);
    if (!url) {
      return NextResponse.json({ message: 'URL not found' }, { status: 404 });
    }

    // Check authorization
    if (url.userId?.toString() !== user.id) {
      return NextResponse.json(
        { message: 'You can only delete your own URLs' },
        { status: 403 }
      );
    }

    // Delete URL
    await Url.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      message: 'URL deleted successfully',
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
