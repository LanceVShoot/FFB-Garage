import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with 5-minute expiration
    await kv.set(`verify:${email}`, code, { ex: 300 });
    
    // Send the email
    await resend.emails.send({
      from: 'FFB Garage <noreply@ffbgarage.com>',
      to: email,
      subject: 'Your FFB Garage Verification Code',
      html: `
        <h1>FFB Garage Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 5 minutes.</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 