import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    console.log('Personality URI:', personalityUri);
    
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    console.log('Database name:', personalityDb.databaseName);
    
    // List all collections
    const collections = await personalityDb.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to access the results collection
    let resultsCount = 0;
    let resultsSample = null;
    let error = null;
    
    try {
      const resultsCollection = personalityDb.collection('results');
      resultsCount = await resultsCollection.countDocuments();
      resultsSample = await resultsCollection.findOne({});
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
    
    // Try to find the specific user
    let specificUser = null;
    try {
      const resultsCollection = personalityDb.collection('results');
      specificUser = await resultsCollection.findOne({ userId: 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2' });
    } catch (err) {
      console.error('Error finding specific user:', err);
    }
    
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        databaseName: personalityDb.databaseName,
        collections: collections.map(c => c.name),
        results: {
          count: resultsCount,
          sample: resultsSample ? {
            userId: resultsSample.userId,
            testType: resultsSample.testType,
            hasAnswers: !!resultsSample.answers
          } : null,
          error: error
        },
        specificUser: specificUser ? {
          userId: specificUser.userId,
          testType: specificUser.testType,
          hasAnswers: !!specificUser.answers
        } : null
      }
    });
  } catch (error) {
    console.error('Test results error:', error);
    return NextResponse.json(
      { error: 'Test results failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

