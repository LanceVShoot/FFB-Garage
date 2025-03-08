import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch distinct values for each filter, excluding null and empty values
        const [makes, models, years, colors, categories] = await Promise.all([
            sql`SELECT DISTINCT make 
                FROM vehicles 
                WHERE NULLIF(make, '') IS NOT NULL 
                ORDER BY make`,
            sql`SELECT DISTINCT model 
                FROM vehicles 
                WHERE NULLIF(model, '') IS NOT NULL 
                ORDER BY model`,
            sql`SELECT DISTINCT year 
                FROM vehicles 
                WHERE year IS NOT NULL 
                ORDER BY year DESC`,
            sql`SELECT DISTINCT color 
                FROM vehicles 
                WHERE NULLIF(color, '') IS NOT NULL 
                ORDER BY color`,
            sql`SELECT DISTINCT category 
                FROM vehicles 
                WHERE NULLIF(category, '') IS NOT NULL 
                ORDER BY category`
        ]);

        // Filter out any remaining null values and convert to arrays
        const response = {
            makes: makes.rows.map(row => row.make).filter(Boolean),
            models: models.rows.map(row => row.model).filter(Boolean),
            years: years.rows.map(row => row.year).filter(Boolean),
            colors: colors.rows.map(row => row.color).filter(Boolean),
            categories: categories.rows.map(row => row.category).filter(Boolean)
        };

        // Check if we got any results
        if (!response.makes.length && !response.models.length && 
            !response.years.length && !response.colors.length && 
            !response.categories.length) {
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