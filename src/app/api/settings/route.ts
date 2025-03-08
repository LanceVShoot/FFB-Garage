import { getFFBSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getFFBSettings();
    return NextResponse.json({ settings });
  } catch (_error: unknown) {
    console.error('API Error:', _error);
    const errorMessage = _error instanceof Error ? _error.message : 'Failed to fetch settings';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
} 