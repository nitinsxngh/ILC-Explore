import { MongoClient, Db } from 'mongodb';

const MONGODB_URI_RESUME = process.env.MONGODB_URI_RESUME || 'mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets';
const MONGODB_URI_PERSONALITY_TEST = process.env.MONGODB_URI_PERSONALITY_TEST || 'mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/results?retryWrites=true&w=majority&appName=hunnidassets';

if (!MONGODB_URI_RESUME) {
  throw new Error('Please define the MONGODB_URI_RESUME environment variable inside .env.local');
}

if (!MONGODB_URI_PERSONALITY_TEST) {
  throw new Error('Please define the MONGODB_URI_PERSONALITY_TEST environment variable inside .env.local');
}

let cachedResumeClient: MongoClient | null = null;
let cachedPersonalityTestClient: MongoClient | null = null;

export async function connectToResumeDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedResumeClient) {
    return {
      client: cachedResumeClient,
      db: cachedResumeClient.db('ilc_resume')
    };
  }

  const client = new MongoClient(MONGODB_URI_RESUME!);
  await client.connect();
  
  cachedResumeClient = client;
  return {
    client,
    db: client.db('ilc_resume')
  };
}

export async function connectToPersonalityTestDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedPersonalityTestClient) {
    return {
      client: cachedPersonalityTestClient,
      db: cachedPersonalityTestClient.db('results')
    };
  }

  const client = new MongoClient(MONGODB_URI_PERSONALITY_TEST!);
  await client.connect();
  
  cachedPersonalityTestClient = client;
  return {
    client,
    db: client.db('results')
  };
}

// Helper function to get user data from resume database
export async function getUserResumeData(userEmail: string) {
  try {
    console.log('Connecting to resume database for userEmail:', userEmail);
    const { db } = await connectToResumeDatabase();
    const collection = db.collection('resumes');
    
    console.log('Searching for resume with userEmail:', userEmail);
    // Search by email in the nested data.basics.email field
    const userResume = await collection.findOne({ "data.basics.email": userEmail });
    console.log('Resume found:', userResume ? 'Yes' : 'No');
    return userResume;
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return null;
  }
}

// Helper function to get user data from personality test database
export async function getUserPersonalityTestData(userEmail: string) {
  try {
    console.log('Connecting to personality test database for userEmail:', userEmail);
    const { db } = await connectToPersonalityTestDatabase();
    const collection = db.collection('ilc_generalpersonalitytest');
    
    console.log('Searching for personality test with userEmail:', userEmail);
    const userTest = await collection.findOne({ userEmail });
    console.log('Personality test found:', userTest ? 'Yes' : 'No');
    return userTest;
  } catch (error) {
    console.error('Error fetching personality test data:', error);
    return null;
  }
}

// Helper function to get all user data
export async function getUserData(userEmail: string) {
  try {
    console.log('Getting user data for userEmail:', userEmail);
    const [resumeData, personalityTestData] = await Promise.all([
      getUserResumeData(userEmail),
      getUserPersonalityTestData(userEmail)
    ]);

    const result = {
      resume: resumeData,
      personalityTest: personalityTestData
    };
    
    console.log('Final user data result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      resume: null,
      personalityTest: null
    };
  }
}
