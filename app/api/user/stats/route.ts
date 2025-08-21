import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { getAuthenticatedUser } from '@/lib/auth';

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

    // Get user stats
    const [urlCount, totalClicksResult] = await Promise.all([
      Url.countDocuments({ userId: user.id }),
      Url.aggregate([
        { $match: { userId: user.id } },
        { $group: { _id: null, totalClicks: { $sum: '$clicks' } } },
      ]),
    ]);

    const totalClicks = totalClicksResult[0]?.totalClicks || 0;

    return NextResponse.json({
      urlCount,
      totalClicks,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
