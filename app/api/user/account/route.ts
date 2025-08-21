import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Url from '@/lib/models/Url';
import Click from '@/lib/models/Click';
import { getAuthenticatedUser } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get all user URLs
    const userUrls = await Url.find({ userId: user.id }).select('_id');
    const urlIds = userUrls.map(url => url._id);

    // Delete all clicks for user URLs
    if (urlIds.length > 0) {
      await Click.deleteMany({ urlId: { $in: urlIds } });
    }

    // Delete all user URLs
    await Url.deleteMany({ userId: user.id });

    // Delete user
    await User.findByIdAndDelete(user.id);

    // Create response to clear cookies
    const response = NextResponse.json({
      message: 'Account deleted successfully',
    });

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Delete user account error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
