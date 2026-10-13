import { NextResponse } from 'next/server';
import { saveContact } from '@/lib/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const docRef = await saveContact({
      name,
      phone,
      email: email || null,
      message: message || null,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
