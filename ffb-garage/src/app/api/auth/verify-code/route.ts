import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    // Get the stored code
    const storedCode = await kv.get(`verify:${email}`);
    
    if (!storedCode || storedCode !== code) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }
    
    // Delete the used code
    await kv.del(`verify:${email}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 