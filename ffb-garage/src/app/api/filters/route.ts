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

        const wheelbasesQuery = sql`
            SELECT DISTINCT wm.name 
            FROM wheelbase_models wm
            JOIN manufacturers m ON m.id = wm.manufacturer_id
            JOIN ffb_settings fs ON fs.wheelbase_model_id = wm.id
            WHERE 1=1
            ${selectedBrand ? sql`AND m.name = ${selectedBrand}` : sql``}
            ${selectedDiscipline ? sql`AND fs.discipline = ${selectedDiscipline}` : sql``}
            ORDER BY wm.name`;

        const disciplinesQuery = sql`
            SELECT DISTINCT discipline 
            FROM ffb_settings fs
            JOIN wheelbase_models wm ON wm.id = fs.wheelbase_model_id
            JOIN manufacturers m ON m.id = wm.manufacturer_id
            WHERE 1=1
            ${selectedBrand ? sql`AND m.name = ${selectedBrand}` : sql``}
            ${selectedModel ? sql`AND wm.name = ${selectedModel}` : sql``}
            ORDER BY discipline`;

        const [manufacturers, wheelbases, disciplines] = await Promise.all([
            manufacturersQuery,
            wheelbasesQuery,
            disciplinesQuery
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