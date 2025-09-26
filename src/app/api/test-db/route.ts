import { NextRequest, NextResponse } from 'next/server';
import { connectToResumeDatabase, connectToPersonalityTestDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Test resume database
    const resumeDb = await connectToResumeDatabase();
    const resumeCollection = resumeDb.db.collection('resumes');
    const resumeCount = await resumeCollection.countDocuments();
    const sampleResume = await resumeCollection.findOne({});
    
    // Test personality test database
    const personalityDb = await connectToPersonalityTestDatabase();
    
    // Check different possible collection names
    const collections = await personalityDb.db.listCollections().toArray();
    console.log('Available collections in personality test DB:', collections.map(c => c.name));
    
    const personalityCollection = personalityDb.db.collection('ilc_generalpersonalitytest');
    const personalityCount = await personalityCollection.countDocuments();
    const samplePersonality = await personalityCollection.findOne({});
    
    // Also check if there's a different collection name
    let alternativeCollection = null;
    let alternativeCount = 0;
    let alternativeSample = null;
    
    for (const collection of collections) {
      if (collection.name.includes('personality') || collection.name.includes('test') || collection.name.includes('general')) {
        const altCollection = personalityDb.db.collection(collection.name);
        const altCount = await altCollection.countDocuments();
        if (altCount > 0) {
          alternativeCollection = collection.name;
          alternativeCount = altCount;
          alternativeSample = await altCollection.findOne({});
          break;
        }
      }
    }
    
    // Also check if the data might be in the resume database
    const resumeCollections = await resumeDb.db.listCollections().toArray();
    console.log('Available collections in resume DB:', resumeCollections.map(c => c.name));
    
    let resumeAlternativeCollection = null;
    let resumeAlternativeCount = 0;
    let resumeAlternativeSample = null;
    
    for (const collection of resumeCollections) {
      if (collection.name.includes('personality') || collection.name.includes('test') || collection.name.includes('general')) {
        const altCollection = resumeDb.db.collection(collection.name);
        const altCount = await altCollection.countDocuments();
        if (altCount > 0) {
          resumeAlternativeCollection = collection.name;
          resumeAlternativeCount = altCount;
          resumeAlternativeSample = await altCollection.findOne({});
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        resume: {
          count: resumeCount,
          sample: sampleResume ? {
            userId: sampleResume.userId,
            title: sampleResume.title,
            hasData: !!sampleResume.data
          } : null
        },
        personality: {
          count: personalityCount,
          sample: samplePersonality ? {
            userId: samplePersonality.userId,
            testType: samplePersonality.testType,
            hasAnswers: !!samplePersonality.answers
          } : null
        },
        alternative: {
          collectionName: alternativeCollection,
          count: alternativeCount,
          sample: alternativeSample ? {
            userId: alternativeSample.userId,
            testType: alternativeSample.testType,
            hasAnswers: !!alternativeSample.answers
          } : null
        },
        resumeAlternative: {
          collectionName: resumeAlternativeCollection,
          count: resumeAlternativeCount,
          sample: resumeAlternativeSample ? {
            userId: resumeAlternativeSample.userId,
            testType: resumeAlternativeSample.testType,
            hasAnswers: !!resumeAlternativeSample.answers
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { error: 'Database test failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
