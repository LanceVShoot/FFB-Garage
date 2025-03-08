import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const selectedBrand = searchParams.get('brand');
        const selectedModel = searchParams.get('model');
        const selectedDiscipline = searchParams.get('discipline');

        // Build the base queries with conditional filtering
        const manufacturersQuery = selectedDiscipline 
            ? sql`
                SELECT DISTINCT m.name 
                FROM manufacturers m
                JOIN wheelbase_models wm ON wm.manufacturer_id = m.id
                JOIN ffb_settings fs ON fs.wheelbase_model_id = wm.id
                WHERE fs.discipline = ${selectedDiscipline}
                ORDER BY m.name`
            : sql`
                SELECT DISTINCT name 
                FROM manufacturers 
                WHERE name IS NOT NULL 
                ORDER BY name`;

        // Build wheelbases query based on conditions
        let wheelbasesSQL = `
            SELECT DISTINCT wm.name 
            FROM wheelbase_models wm
            JOIN manufacturers m ON m.id = wm.manufacturer_id
            JOIN ffb_settings fs ON fs.wheelbase_model_id = wm.id
            WHERE 1=1`;

        const wheelbasesParams = [];
        if (selectedBrand) {
            wheelbasesSQL += ` AND m.name = $${wheelbasesParams.length + 1}`;
            wheelbasesParams.push(selectedBrand);
        }
        if (selectedDiscipline) {
            wheelbasesSQL += ` AND fs.discipline = $${wheelbasesParams.length + 1}`;
            wheelbasesParams.push(selectedDiscipline);
        }
        wheelbasesSQL += ` ORDER BY wm.name`;

        // Build disciplines query based on conditions
        let disciplinesSQL = `
            SELECT DISTINCT discipline 
            FROM ffb_settings fs
            JOIN wheelbase_models wm ON wm.id = fs.wheelbase_model_id
            JOIN manufacturers m ON m.id = wm.manufacturer_id
            WHERE 1=1`;

        const disciplinesParams = [];
        if (selectedBrand) {
            disciplinesSQL += ` AND m.name = $${disciplinesParams.length + 1}`;
            disciplinesParams.push(selectedBrand);
        }
        if (selectedModel) {
            disciplinesSQL += ` AND wm.name = $${disciplinesParams.length + 1}`;
            disciplinesParams.push(selectedModel);
        }
        disciplinesSQL += ` ORDER BY discipline`;

        const [manufacturers, wheelbases, disciplines] = await Promise.all([
            manufacturersQuery,
            sql.query(wheelbasesSQL, wheelbasesParams),
            sql.query(disciplinesSQL, disciplinesParams)
        ]);

        const response = {
            manufacturers: manufacturers.rows.map(row => row.name).filter(Boolean),
            wheelbases: wheelbases.rows.map(row => row.name).filter(Boolean),
            disciplines: disciplines.rows.map(row => row.discipline).filter(Boolean)
        };

        if (!response.manufacturers.length && !response.wheelbases.length && 
            !response.disciplines.length) {
            return NextResponse.json(
                { error: 'No filter options found in database' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return NextResponse.json(
            { error: 'Failed to fetch filter options', details: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        );
    }
} 