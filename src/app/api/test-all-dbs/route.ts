import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const resumeUri = process.env.MONGODB_URI_RESUME;
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    
    console.log('Resume URI:', resumeUri);
    console.log('Personality URI:', personalityUri);
    
    // Test resume database
    const resumeClient = new MongoClient(resumeUri!);
    await resumeClient.connect();
    const resumeDb = resumeClient.db();
    const resumeCollections = await resumeDb.listCollections().toArray();
    
    // Test personality test database
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    const personalityCollections = await personalityDb.listCollections().toArray();
    
    // Try to find the results collection in both databases
    let resultsInResume = null;
    let resultsInPersonality = null;
    
    try {
      const resumeResults = resumeDb.collection('results');
      const resumeResultsCount = await resumeResults.countDocuments();
      if (resumeResultsCount > 0) {
        resultsInResume = {
          count: resumeResultsCount,
          sample: await resumeResults.findOne({})
        };
      }
    } catch (err) {
      console.log('No results collection in resume DB');
    }
    
    try {
      const personalityResults = personalityDb.collection('results');
      const personalityResultsCount = await personalityResults.countDocuments();
      if (personalityResultsCount > 0) {
        resultsInPersonality = {
          count: personalityResultsCount,
          sample: await personalityResults.findOne({})
        };
      }
    } catch (err) {
      console.log('No results collection in personality DB');
    }
    
    await resumeClient.close();
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        resumeDb: {
          name: resumeDb.databaseName,
          collections: resumeCollections.map(c => c.name),
          results: resultsInResume
        },
        personalityDb: {
          name: personalityDb.databaseName,
          collections: personalityCollections.map(c => c.name),
          results: resultsInPersonality
        }
      }
    });
  } catch (error) {
    console.error('Test all DBs error:', error);
    return NextResponse.json(
      { error: 'Test all DBs failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

