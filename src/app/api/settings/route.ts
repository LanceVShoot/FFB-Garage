import { getFFBSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getFFBSettings();
    return NextResponse.json({ settings });
  } catch {
    console.error('API Error:');
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch settings';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
} 