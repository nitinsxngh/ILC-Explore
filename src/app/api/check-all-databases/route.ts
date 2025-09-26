import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Use the same MongoDB URI but without specifying a database
    const baseUri = 'mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/?retryWrites=true&w=majority&appName=hunnidassets';
    
    const client = new MongoClient(baseUri);
    await client.connect();
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    
    const results = [];
    
    for (const dbInfo of databases.databases) {
      if (dbInfo.name.includes('ilc') || dbInfo.name.includes('personality') || dbInfo.name.includes('resume')) {
        const db = client.db(dbInfo.name);
        const collections = await db.listCollections().toArray();
        
        // Check if this database has a results collection
        let resultsCount = 0;
        let hasResults = false;
        try {
          const resultsCollection = db.collection('results');
          resultsCount = await resultsCollection.countDocuments();
          hasResults = resultsCount > 0;
        } catch (err) {
          // Collection doesn't exist
        }
        
        results.push({
          name: dbInfo.name,
          sizeOnDisk: dbInfo.sizeOnDisk,
          collections: collections.map(c => c.name),
          hasResults,
          resultsCount
        });
      }
    }
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      data: {
        databases: results
      }
    });
  } catch (error) {
    console.error('Check all databases error:', error);
    return NextResponse.json(
      { error: 'Check all databases failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

