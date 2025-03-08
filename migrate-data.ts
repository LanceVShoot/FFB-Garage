import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import ffbSettingsData from './ffb-garage/src/data/ffb-settings.json';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file for local development
dotenv.config();

// Use either Vercel's environment variable or fall back to local .env
const databaseUrl = process.env.NEON_DATABASE_URL || process.env.LOCAL_NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('No database connection string found. Please ensure either NEON_DATABASE_URL or LOCAL_NEON_DATABASE_URL is set.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function migrateData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Drop existing tables in correct order
    await client.query(`
      DROP TABLE IF EXISTS setting_values CASCADE;
      DROP TABLE IF EXISTS ffb_settings CASCADE;
      DROP TABLE IF EXISTS setting_fields CASCADE;
      DROP TABLE IF EXISTS wheelbase_models CASCADE;
      DROP TABLE IF EXISTS manufacturers CASCADE;
    `);

    // Read and execute schema.sql
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);

    // Insert manufacturers
    const manufacturers = new Map();
    for (const setting of ffbSettingsData.settings) {
      if (!manufacturers.has(setting.brand)) {
        const result = await client.query(
          'INSERT INTO manufacturers (name) VALUES ($1) RETURNING id',
          [setting.brand]
        );
        manufacturers.set(setting.brand, result.rows[0].id);
      }
    }

    // Insert wheelbase models
    const models = new Map();
    for (const setting of ffbSettingsData.settings) {
      const manufacturerId = manufacturers.get(setting.brand);
      const result = await client.query(
        'INSERT INTO wheelbase_models (manufacturer_id, name) VALUES ($1, $2) RETURNING id',
        [manufacturerId, setting.model]
      );
      models.set(`${setting.brand}-${setting.model}`, result.rows[0].id);
    }

    // Insert setting fields
    const fields = new Map();
    for (const setting of ffbSettingsData.settings) {
      const manufacturerId = manufacturers.get(setting.brand);
      // Convert settings object to array of values
      const settingValues = Object.entries(setting.settings).map(([fieldName, value]) => ({
        fieldName,
        displayName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        value,
        minValue: 0,  // You might want to adjust these defaults
        maxValue: 100 // based on your actual requirements
      }));
      
      for (const value of settingValues) {
        if (!fields.has(`${manufacturerId}-${value.fieldName}`)) {
          const result = await client.query(
            `INSERT INTO setting_fields 
             (manufacturer_id, field_name, display_name, min_value, max_value) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id`,
            [
              manufacturerId,
              value.fieldName,
              value.displayName,
              value.minValue,
              value.maxValue
            ]
          );
          fields.set(`${manufacturerId}-${value.fieldName}`, result.rows[0].id);
        }
      }
    }

    // Insert FFB settings and values
    for (const setting of ffbSettingsData.settings) {
      const modelId = models.get(`${setting.brand}-${setting.model}`);
      
      const ffbResult = await client.query(
        `INSERT INTO ffb_settings 
         (wheelbase_model_id, car_name, discipline, is_manufacturer_provided, likes) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [
          modelId,
          setting.car,
          setting.discipline,
          setting.is_manufacturer_provided,
          setting.likes || 0
        ]
      );

      const ffbSettingId = ffbResult.rows[0].id;
      const manufacturerId = manufacturers.get(setting.brand);
      
      // Convert settings object to array and insert values
      for (const [fieldName, value] of Object.entries(setting.settings)) {
        const fieldId = fields.get(`${manufacturerId}-${fieldName}`);
        
        await client.query(
          'INSERT INTO setting_values (ffb_setting_id, setting_field_id, value) VALUES ($1, $2, $3)',
          [ffbSettingId, fieldId, value]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Data migration completed successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during migration:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrateData().catch(console.error); 