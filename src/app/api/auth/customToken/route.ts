import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

const COOKIE_NAME = process.env.ILC_SESSION_COOKIE_NAME || 'ilc_session';

export async function POST() {
  try {
    const sessionCookie = cookies().get(COOKIE_NAME)?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'No session' }, { status: 401 });

    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const customToken = await admin.auth().createCustomToken(decoded.sub);

    return NextResponse.json({ ok: true, customToken });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unauthorized' }, { status: 401 });
  }
}

