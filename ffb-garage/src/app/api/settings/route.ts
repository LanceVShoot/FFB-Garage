import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await sql`
      SELECT 
        fs.id,
        fs.car_name as "carName",
        m.id as "manufacturer.id",
        m.name as "manufacturer.name",
        fs.model,
        fs.discipline,
        fs.is_manufacturer_provided as "isManufacturerProvided",
        fs.likes,
        fs.created_by as "createdBy",
        json_agg(
          json_build_object(
            'id', msf.id,
            'fieldName', msf.field_name,
            'displayName', msf.display_name,
            'value', sv.value,
            'unit', msf.unit
          )
        ) as "settingValues"
      FROM ffb_settings fs
      JOIN manufacturers m ON fs.manufacturer_id = m.id
      JOIN setting_values sv ON fs.id = sv.ffb_setting_id
      JOIN manufacturer_setting_fields msf ON sv.setting_field_id = msf.id
      GROUP BY fs.id, m.id;
    `;

    // Transform the data to match the FFBSetting type
    const transformedSettings = settings.rows.map(row => ({
      id: row.id,
      carName: row.carName,
      manufacturer: {
        id: row.manufacturer?.id,
        name: row.manufacturer?.name
      },
      model: row.model,
      discipline: row.discipline,
      isManufacturerProvided: row.isManufacturerProvided,
      likes: row.likes,
      createdBy: row.createdBy,
      settingValues: row.settingValues
    }));

    return NextResponse.json({ settings: transformedSettings });
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