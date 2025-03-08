import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

dotenv.config();

// Use either Vercel's environment variable or fall back to local .env
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.LOCAL_NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('No database connection string found. Please ensure either NEON_DATABASE_URL or LOCAL_NEON_DATABASE_URL is set.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export async function getFFBSettings() {
  try {
    const result = await sql`
      SELECT 
        f.id,
        f.car_name as car,
        f.discipline,
        f.is_manufacturer_provided,
        f.likes,
        m.name as brand,
        wm.name as model,
        json_object_agg(sf.field_name, sv.value) as settings
      FROM ffb_settings f
      JOIN wheelbase_models wm ON f.wheelbase_model_id = wm.id
      JOIN manufacturers m ON wm.manufacturer_id = m.id
      JOIN setting_values sv ON sv.ffb_setting_id = f.id
      JOIN setting_fields sf ON sv.setting_field_id = sf.id
      GROUP BY f.id, m.name, wm.name
      ORDER BY f.id
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
} 