import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { getAuthenticatedUser } from '@/lib/auth';

interface Context {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Context) {
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
        { message: 'You can only reactivate your own URLs' },
        { status: 403 }
      );
    }

    // Calculate new expiration date (default 90 days from now)
    const extensionDays = 90;
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + extensionDays);

    // Reactivate URL
    const updatedUrl = await Url.findByIdAndUpdate(
      resolvedParams.id,
      {
        isActive: true,
        expiresAt: newExpirationDate,
      },
      { new: true }
    );

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
    console.error('Reactivate URL error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
