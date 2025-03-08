import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await sql`
      SELECT 
        fs.id,
        fs.car_name,
        m.id as manufacturer_id,
        m.name as manufacturer_name,
        fs.model,
        fs.discipline,
        fs.is_manufacturer_provided,
        fs.likes,
        fs.created_by,
        json_agg(
          json_build_object(
            'fieldId', msf.id,
            'fieldName', msf.field_name,
            'displayName', msf.display_name,
            'value', sv.value,
            'unit', msf.unit
          )
        ) as setting_values
      FROM ffb_settings fs
      JOIN manufacturers m ON fs.manufacturer_id = m.id
      JOIN setting_values sv ON fs.id = sv.ffb_setting_id
      JOIN manufacturer_setting_fields msf ON sv.setting_field_id = msf.id
      GROUP BY fs.id, m.id;
    `;

    return NextResponse.json(settings.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
} 