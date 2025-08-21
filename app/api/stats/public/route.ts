import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import Click from '@/lib/models/Click';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all public stats in parallel
    const [totalUrls, totalClicks, totalUsers, uniqueCountries] =
      await Promise.all([
        // Total URLs created
        Url.countDocuments(),

        // Total clicks across all URLs
        Url.aggregate([
          { $group: { _id: null, totalClicks: { $sum: '$clicks' } } },
        ]).then((result) => result[0]?.totalClicks || 0),

        // Total registered users
        User.countDocuments(),

        // Count unique countries from clicks
        Click.distinct('country').then(
          (countries) =>
            countries.filter((country) => country && country.trim() !== '')
              .length
        ),
      ]);

    // Calculate uptime (assuming 99.9% for now, could be made dynamic)
    const uptime = 99.9;

    return NextResponse.json({
      totalUrls,
      totalClicks,
      totalUsers,
      uniqueCountries,
      uptime,
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cache for 5 minutes
export const revalidate = 300;
