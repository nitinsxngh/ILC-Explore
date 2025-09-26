import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const resumeUri = process.env.MONGODB_URI_RESUME;
    const personalityUri = process.env.MONGODB_URI_PERSONALITY_TEST;
    
    // Check resume database
    const resumeClient = new MongoClient(resumeUri!);
    await resumeClient.connect();
    const resumeDb = resumeClient.db();
    
    const resumeCollection = resumeDb.collection('resumes');
    const sampleResume = await resumeCollection.findOne({});
    
    // Check personality test database
    const personalityClient = new MongoClient(personalityUri!);
    await personalityClient.connect();
    const personalityDb = personalityClient.db();
    
    const quizCollection = personalityDb.collection('quizresponses');
    const sampleQuiz = await quizCollection.findOne({});
    
    await resumeClient.close();
    await personalityClient.close();
    
    return NextResponse.json({
      success: true,
      data: {
        sampleResume: sampleResume ? {
          userId: sampleResume.userId,
          title: sampleResume.title,
          hasData: !!sampleResume.data,
          keys: Object.keys(sampleResume)
        } : null,
        sampleQuiz: sampleQuiz ? {
          userId: sampleQuiz.userId,
          hasAnswers: !!sampleQuiz.responses,
          keys: Object.keys(sampleQuiz)
        } : null
      }
    });
  } catch (error) {
    console.error('Check existing data error:', error);
    return NextResponse.json(
      { error: 'Check existing data failed', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
