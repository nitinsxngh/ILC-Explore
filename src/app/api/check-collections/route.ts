import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    // Check quizresponses collection
    const quizCollection = personalityDb.collection('quizresponses');
    const quizCount = await quizCollection.countDocuments();
    const quizSample = await quizCollection.findOne({});
    
    // Check users collection
    const usersCollection = personalityDb.collection('users');
    const usersCount = await usersCollection.countDocuments();
    const usersSample = await usersCollection.findOne({});
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        quizresponses: {
          count: quizCount,
          sample: quizSample ? {
            userId: quizSample.userId,
            testType: quizSample.testType,
            hasAnswers: !!quizSample.answers,
            keys: Object.keys(quizSample)
          } : null
        },
        users: {
          count: usersCount,
          sample: usersSample ? {
            userId: usersSample.userId,
            keys: Object.keys(usersSample)
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Collection check error:', error);
    return NextResponse.json(
      { error: 'Collection check failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
