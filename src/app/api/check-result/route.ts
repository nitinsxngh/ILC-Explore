import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    // Check result collection
    const resultCollection = personalityDb.collection('result');
    const resultCount = await resultCollection.countDocuments();
    const resultSample = await resultCollection.findOne({});
    
    // Also check for the specific user ID from the logs
    const specificUser = await resultCollection.findOne({ userId: 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2' });
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        result: {
          count: resultCount,
          sample: resultSample ? {
            userId: resultSample.userId,
            testType: resultSample.testType,
            hasAnswers: !!resultSample.answers,
            keys: Object.keys(resultSample)
          } : null
        },
        specificUser: specificUser ? {
          userId: specificUser.userId,
          testType: specificUser.testType,
          hasAnswers: !!specificUser.answers,
          keys: Object.keys(specificUser)
        } : null
      }
    });
  } catch (error) {
    console.error('Result check error:', error);
    return NextResponse.json(
      { error: 'Result check failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
