import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function createVerificationCode(email: string, code: string) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  
  await sql`
    INSERT INTO verification_codes (email, code, expires_at)
    VALUES (${email}, ${code}, ${expiresAt})
  `;
}

export async function verifyCode(email: string, code: string) {
  const result = await sql`
    SELECT id
    FROM verification_codes
    WHERE email = ${email}
      AND code = ${code}
      AND expires_at > CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (result.length === 0) {
    return false;
  }

  // Delete the used code
  await sql`
    DELETE FROM verification_codes
    WHERE email = ${email}
  `;

  // Create or update user
  await sql`
    INSERT INTO users (email)
    VALUES (${email})
    ON CONFLICT (email) DO NOTHING
  `;

  return true;
}

export async function cleanupExpiredCodes() {
  await sql`
    DELETE FROM verification_codes
    WHERE expires_at < CURRENT_TIMESTAMP
  `;
}

export async function checkEmailAttempts(email: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  const attempts = await sql`
    SELECT COUNT(*) 
    FROM verification_codes 
    WHERE email = ${email} 
    AND created_at > ${fifteenMinutesAgo}
  `;

  return parseInt(attempts[0].count) < 3;
} 