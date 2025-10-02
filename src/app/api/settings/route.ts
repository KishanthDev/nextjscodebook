import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // your clientPromise import

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  if (!section) {
    return NextResponse.json({ message: 'Missing section parameter' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('UiModifier');
    const collection = db.collection('settings');

    const settingsDoc = await collection.findOne({});

    if (!settingsDoc || !settingsDoc[section]) {
      return NextResponse.json({ message: 'No settings found for this section' }, { status: 404 });
    }

    return NextResponse.json({ settings: settingsDoc[section] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { section, data } = body;

  if (!section || !data) {
    return NextResponse.json({ message: 'Missing section or data' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('UiModifier');
    const collection = db.collection('settings');

    await collection.updateOne(
      {},
      { $set: { [section]: data } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Settings updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
