import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    console.log('Personality URI:', personalityUri);
    
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    
    // Try to connect to ilc_personalitytest database
    const personalityDb = personalityClient.db('ilc_personalitytest');
    
    // Try to access the subcollection
    const subcollection = personalityDb.collection('results.ilc_generalpersonalitytest');
    const count = await subcollection.countDocuments();
    const sample = await subcollection.findOne({});
    const specificUser = await subcollection.findOne({ userId: 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2' });
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        databaseName: 'ilc_personalitytest',
        subcollection: 'results.ilc_generalpersonalitytest',
        count: count,
        sample: sample ? {
          userId: sample.userId,
          testType: sample.testType,
          hasAnswers: !!sample.answers
        } : null,
        specificUser: specificUser ? {
          userId: specificUser.userId,
          testType: specificUser.testType,
          hasAnswers: !!specificUser.answers
        } : null
      }
    });
  } catch (error) {
    console.error('Test subcollection error:', error);
    return NextResponse.json(
      { error: 'Test subcollection failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

