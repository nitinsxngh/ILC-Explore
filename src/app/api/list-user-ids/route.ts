import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const resumeUri = process.env.MONGODB_URI_RESUME;
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    
    // Check resume database
    const resumeClient = new MongoClient(resumeUri!);
    await resumeClient.connect();
    const resumeDb = resumeClient.db();
    
    const resumeCollection = resumeDb.collection('resumes');
    const resumeUsers = await resumeCollection.distinct('userId');
    
    // Check personality test database
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    const quizCollection = personalityDb.collection('quizresponses');
    const quizUsers = await quizCollection.distinct('userId');
    
    const usersCollection = personalityDb.collection('users');
    const usersUsers = await usersCollection.distinct('_id');
    
    await resumeClient.close();
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        resumeUserIds: resumeUsers,
        quizUserIds: quizUsers,
        usersUserIds: usersUsers,
        totalResumeUsers: resumeUsers.length,
        totalQuizUsers: quizUsers.length,
        totalUsersUsers: usersUsers.length
      }
    });
  } catch (error) {
    console.error('List user IDs error:', error);
    return NextResponse.json(
      { error: 'List user IDs failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
