import { NextRequest, NextResponse } from 'next/server';
import { connectToExploreDatabase, getUserProfile, createOrUpdateUserProfile } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      return NextResponse.json(
        { message: 'User profile not found', profile: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, mentorDetails } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if profile exists
    const existingProfile = await getUserProfile(userId);
    
    const profileData: any = {
      userId,
    };

    // Only set createdAt if it's a new profile
    if (!existingProfile) {
      profileData.createdAt = new Date();
    }

    if (role) {
      profileData.role = role;
    }

    if (mentorDetails) {
      profileData.mentorDetails = {
        ...mentorDetails,
        completed: true,
      };
    }

    const result = await createOrUpdateUserProfile(userId, profileData);

    return NextResponse.json(
      { message: 'User profile updated successfully', profile: result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await createOrUpdateUserProfile(userId, updateData);

    return NextResponse.json(
      { message: 'User profile updated successfully', profile: result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile', details: error.message },
      { status: 500 }
    );
  }
}

