import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch distinct values for each filter from the correct tables
        const [manufacturers, wheelbases, cars, disciplines] = await Promise.all([
            sql`SELECT DISTINCT name 
                FROM manufacturers 
                WHERE name IS NOT NULL 
                ORDER BY name`,
            sql`SELECT DISTINCT wm.name 
                FROM wheelbase_models wm
                WHERE wm.name IS NOT NULL 
                ORDER BY wm.name`,
            sql`SELECT DISTINCT car_name 
                FROM ffb_settings 
                WHERE car_name IS NOT NULL 
                ORDER BY car_name`,
            sql`SELECT DISTINCT discipline 
                FROM ffb_settings 
                WHERE discipline IS NOT NULL 
                ORDER BY discipline`
        ]);

        // Filter out any remaining null values and convert to arrays
        const response = {
            manufacturers: manufacturers.rows.map(row => row.name).filter(Boolean),
            wheelbases: wheelbases.rows.map(row => row.name).filter(Boolean),
            cars: cars.rows.map(row => row.car_name).filter(Boolean),
            disciplines: disciplines.rows.map(row => row.discipline).filter(Boolean)
        };

        // Check if we got any results
        if (!response.manufacturers.length && !response.wheelbases.length && 
            !response.cars.length && !response.disciplines.length) {
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