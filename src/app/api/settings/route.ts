import { getFFBSettings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getFFBSettings();
    return NextResponse.json({ settings });
  } catch (e: unknown) {
    const errorDetails = {
      message: e instanceof Error ? e.message : 'Failed to fetch settings',
      raw: e
    };
    console.error('API Error:', errorDetails);
    return NextResponse.json(
      { error: errorDetails.message }, 
      { status: 500 }
    );
  }
} 