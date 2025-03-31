import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    
    const isValid = await verifyCode(email, code);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 