import admin from 'firebase-admin';

function getPrivateKey() {
  const k = process.env.FIREBASE_PRIVATE_KEY;
  if (!k) return undefined;
  return k.includes('\\n') ? k.replace(/\\n/g, '\n') : k;
}

export function getFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });

  return admin;
}

