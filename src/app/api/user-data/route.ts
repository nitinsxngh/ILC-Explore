import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get userEmail from query parameters
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    console.log('Fetching data for userEmail:', userEmail); // Debug log

    const userData = await getUserData(userEmail);
    
    console.log('User data fetched:', userData); // Debug log

    return NextResponse.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
