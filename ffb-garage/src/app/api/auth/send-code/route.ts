import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createVerificationCode, cleanupExpiredCodes, checkEmailAttempts } from '@/lib/db';

// Log the API key (temporarily, for debugging)
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log('Received request to send verification code');
    const { email } = await request.json();
    console.log('Email:', email);

    // Check rate limit
    const canSendEmail = await checkEmailAttempts(email);
    if (!canSendEmail) {
      return NextResponse.json(
        { error: 'rate_limit', message: 'Too many attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }
    
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated code:', code);
    
    // Clean up expired codes
    await cleanupExpiredCodes();
    
    // Store the new code
    await createVerificationCode(email, code);
    
    console.log('Attempting to send email via Resend');
    try {
      // Send the email with more detailed error handling
      const emailResult = await resend.emails.send({
        from: 'verify@ffbgarage.com', // Make sure this is a verified domain in Resend
        to: email,
        subject: 'Your FFB Garage Verification Code',
        html: `
          <h1>FFB Garage Verification Code</h1>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `
      });
      console.log('Resend response:', emailResult);
    } catch (emailError) {
      console.error('Resend specific error:', emailError);
      throw emailError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 