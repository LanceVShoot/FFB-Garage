import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch distinct values for each filter
        const [makes, models, years, colors, categories] = await Promise.all([
            sql`SELECT DISTINCT make FROM vehicles ORDER BY make`,
            sql`SELECT DISTINCT model FROM vehicles ORDER BY model`,
            sql`SELECT DISTINCT year FROM vehicles ORDER BY year DESC`,
            sql`SELECT DISTINCT color FROM vehicles ORDER BY color`,
            sql`SELECT DISTINCT category FROM vehicles ORDER BY category`
        ]);

        return NextResponse.json({
            makes: makes.rows.map(row => row.make),
            models: models.rows.map(row => row.model),
            years: years.rows.map(row => row.year),
            colors: colors.rows.map(row => row.color),
            categories: categories.rows.map(row => row.category)
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return NextResponse.json({ error: 'Failed to fetch filter options' }, { status: 500 });
    }
} 