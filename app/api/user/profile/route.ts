import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getAuthenticatedUser } from '@/lib/auth';
import { UpdateUserDto } from '@/lib/types';

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

    // Find user
    const userData = await User.findById(user.id).select(
      'email name role isVerified createdAt updatedAt'
    );

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: userData._id.toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isVerified,
      createdAt: userData.createdAt.toISOString(),
      updatedAt: userData.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body: UpdateUserDto = await request.json();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(user.id, body, {
      new: true,
    }).select('email name role isVerified createdAt updatedAt');

    return NextResponse.json({
      id: updatedUser!._id.toString(),
      email: updatedUser!.email,
      name: updatedUser!.name,
      role: updatedUser!.role,
      isVerified: updatedUser!.isVerified,
      createdAt: updatedUser!.createdAt.toISOString(),
      updatedAt: updatedUser!.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
