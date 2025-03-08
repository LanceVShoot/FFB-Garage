import { getFFBSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getFFBSettings();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    // Explicitly use the error variable to satisfy ESLint
    const errorLog = {
      type: error?.constructor?.name,
      details: error instanceof Error ? error.message : String(error)
    };
    console.error('API Error:', errorLog);
    return NextResponse.json(
      { error: errorLog.details }, 
      { status: 500 }
    );
  }
} 