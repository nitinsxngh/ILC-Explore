import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const resumeUri = process.env.MONGODB_URI_RESUME;
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    
    console.log('Resume URI:', resumeUri);
    console.log('Personality URI:', personalityUri);
    
    // Connect to resume database
    const resumeClient = new MongoClient(resumeUri!);
    await resumeClient.connect();
    const resumeDb = resumeClient.db();
    const resumeCollections = await resumeDb.listCollections().toArray();
    console.log('Resume DB collections:', resumeCollections.map(c => c.name));
    
    // Connect to personality test database
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    const personalityCollections = await personalityDb.listCollections().toArray();
    console.log('Personality DB collections:', personalityCollections.map(c => c.name));
    
    // Check for any collection with 'general' in the name
    let generalCollection = null;
    let generalCount = 0;
    let generalSample = null;
    
    for (const collection of personalityCollections) {
      if (collection.name.includes('general')) {
        const coll = personalityDb.collection(collection.name);
        const count = await coll.countDocuments();
        if (count > 0) {
          generalCollection = collection.name;
          generalCount = count;
          generalSample = await coll.findOne({});
          break;
        }
      }
    }
    
    await resumeClient.close();
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        resumeDb: {
          name: resumeDb.databaseName,
          collections: resumeCollections.map(c => c.name)
        },
        personalityDb: {
          name: personalityDb.databaseName,
          collections: personalityCollections.map(c => c.name)
        },
        generalCollection: {
          name: generalCollection,
          count: generalCount,
          sample: generalSample ? {
            userId: generalSample.userId,
            testType: generalSample.testType,
            hasAnswers: !!generalSample.answers
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
