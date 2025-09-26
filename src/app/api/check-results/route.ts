import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    // Check results collection
    const resultsCollection = personalityDb.collection('results');
    const resultsCount = await resultsCollection.countDocuments();
    const resultsSample = await resultsCollection.findOne({});
    
    // Also check for the specific user ID from the logs
    const specificUser = await resultsCollection.findOne({ userId: 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2' });
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        results: {
          count: resultsCount,
          sample: resultsSample ? {
            userId: resultsSample.userId,
            testType: resultsSample.testType,
            hasAnswers: !!resultsSample.answers,
            keys: Object.keys(resultsSample)
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
    console.error('Results check error:', error);
    return NextResponse.json(
      { error: 'Results check failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
