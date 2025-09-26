import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'uRKBQo0Be6OwVw0XGvoWHpwKqLh2';
    
    const resumeUri = process.env.MONGODB_URI_RESUME;
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    
    // Check resume database
    const resumeClient = new MongoClient(resumeUri!);
    await resumeClient.connect();
    const resumeDb = resumeClient.db();
    
    // Check all collections in resume database
    const resumeCollections = await resumeDb.listCollections().toArray();
    let resumeData = null;
    
    for (const collection of resumeCollections) {
      const coll = resumeDb.collection(collection.name);
      const userResume = await coll.findOne({ userId });
      if (userResume) {
        resumeData = {
          collection: collection.name,
          data: userResume
        };
        break;
      }
    }
    
    // Check personality test database
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    // Check all collections in personality test database
    const personalityCollections = await personalityDb.listCollections().toArray();
    let personalityData = null;
    
    for (const collection of personalityCollections) {
      const coll = personalityDb.collection(collection.name);
      const userTest = await coll.findOne({ userId });
      if (userTest) {
        personalityData = {
          collection: collection.name,
          data: userTest
        };
        break;
      }
    }
    
    await resumeClient.close();
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        userId,
        resumeData,
        personalityData,
        resumeCollections: resumeCollections.map(c => c.name),
        personalityCollections: personalityCollections.map(c => c.name)
      }
    });
  } catch (error) {
    console.error('Find user data error:', error);
    return NextResponse.json(
      { error: 'Find user data failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
