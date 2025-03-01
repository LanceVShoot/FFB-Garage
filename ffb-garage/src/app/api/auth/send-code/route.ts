import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createVerificationCode, cleanupExpiredCodes } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log('Received request to send verification code');
    const { email } = await request.json();
    console.log('Email:', email);
    
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated code:', code);
    
    // Clean up expired codes
    await cleanupExpiredCodes();
    
    // Store the new code
    await createVerificationCode(email, code);
    
    console.log('Attempting to send email via Resend');
    // Send the email
    const emailResult = await resend.emails.send({
      from: 'FFB Garage <noreply@ffbgarage.com>',
      to: email,
      subject: 'Your FFB Garage Verification Code',
      html: `
        <h1>FFB Garage Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 5 minutes.</p>
      `
    });
    console.log('Resend response:', emailResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 