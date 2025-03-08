import { getFFBSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getFFBSettings();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    const err = error;
    console.error('API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
} 