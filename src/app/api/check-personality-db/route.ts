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
    const collections = await personalityDb.listCollections().toArray();
    console.log('Collections in ilc_personalitytest:', collections.map(c => c.name));
    
    // Check for results collection
    let resultsCount = 0;
    let resultsSample = null;
    let specificUser = null;
    
    try {
      const resultsCollection = personalityDb.collection('results');
      resultsCount = await resultsCollection.countDocuments();
      resultsSample = await resultsCollection.findOne({});
      specificUser = await resultsCollection.findOne({ userId: 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2' });
    } catch (err) {
      console.error('Error accessing results collection:', err);
    }
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        databaseName: 'ilc_personalitytest',
        collections: collections.map(c => c.name),
        results: {
          count: resultsCount,
          sample: resultsSample ? {
            userId: resultsSample.userId,
            testType: resultsSample.testType,
            hasAnswers: !!resultsSample.answers
          } : null
        },
        specificUser: specificUser ? {
          userId: specificUser.userId,
          testType: specificUser.testType,
          hasAnswers: !!specificUser.answers
        } : null
      }
    });
  } catch (error) {
    console.error('Check personality DB error:', error);
    return NextResponse.json(
      { error: 'Check personality DB failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

