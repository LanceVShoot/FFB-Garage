import React, { useState, useEffect } from 'react';

const [filterOptions, setFilterOptions] = useState({
    makes: ['All'],
    models: ['All'],
    years: ['All'],
    colors: ['All'],
    categories: ['All']
});

useEffect(() => {
    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('/api/filters');
            const data = await response.json();
            setFilterOptions({
                makes: ['All', ...data.makes],
                models: ['All', ...data.models],
                years: ['All', ...data.years.map(String)],
                colors: ['All', ...data.colors],
                categories: ['All', ...data.categories]
            });
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    fetchFilterOptions();
}, []);

<select
    value={filters.make}
    onChange={(e) => handleFilterChange('make', e.target.value)}
    className="p-2 border rounded"
>
    {filterOptions.makes.map((make) => (
        <option key={make} value={make}>{make}</option>
    ))}
</select>

<select
    value={filters.model}
    onChange={(e) => handleFilterChange('model', e.target.value)}
    className="p-2 border rounded"
>
    {filterOptions.models.map((model) => (
        <option key={model} value={model}>{model}</option>
    ))}
</select>

<select
    value={filters.year}
    onChange={(e) => handleFilterChange('year', e.target.value)}
    className="p-2 border rounded"
>
    {filterOptions.years.map((year) => (
        <option key={year} value={year}>{year}</option>
    ))}
</select>

<select
    value={filters.color}
    onChange={(e) => handleFilterChange('color', e.target.value)}
    className="p-2 border rounded"
>
    {filterOptions.colors.map((color) => (
        <option key={color} value={color}>{color}</option>
    ))}
</select>

<select
    value={filters.category}
    onChange={(e) => handleFilterChange('category', e.target.value)}
    className="p-2 border rounded"
>
    {filterOptions.categories.map((category) => (
        <option key={category} value={category}>{category}</option>
    ))}
</select> 