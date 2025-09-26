import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2';

    console.log('Testing user data for userId:', userId);
    const userData = await getUserData(userId);
    
    console.log('User data result:', userData);

    return NextResponse.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Test user data error:', error);
    return NextResponse.json(
      { error: 'Test user data failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

