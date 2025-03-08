-- Create manufacturers table
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE(name)
);

-- Create wheelbase models table
CREATE TABLE wheelbase_models (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER REFERENCES manufacturers(id),
    name VARCHAR(255) NOT NULL,
    UNIQUE(manufacturer_id, name)
);

-- Create setting fields table (defines available settings per manufacturer)
CREATE TABLE setting_fields (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER REFERENCES manufacturers(id),
    field_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    min_value NUMERIC,
    max_value NUMERIC,
    unit VARCHAR(50),
    UNIQUE(manufacturer_id, field_name)
);

-- Create main FFB settings table
CREATE TABLE ffb_settings (
    id SERIAL PRIMARY KEY,
    wheelbase_model_id INTEGER REFERENCES wheelbase_models(id),
    car_name VARCHAR(255) NOT NULL,
    discipline VARCHAR(255) NOT NULL,
    is_manufacturer_provided BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(wheelbase_model_id, car_name)
);

-- Create setting values table
CREATE TABLE setting_values (
    id SERIAL PRIMARY KEY,
    ffb_setting_id INTEGER REFERENCES ffb_settings(id),
    setting_field_id INTEGER REFERENCES setting_fields(id),
    value NUMERIC NOT NULL,
    UNIQUE(ffb_setting_id, setting_field_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_ffb_settings_wheelbase ON ffb_settings(wheelbase_model_id);
CREATE INDEX idx_setting_values_ffb_setting ON setting_values(ffb_setting_id);
CREATE INDEX idx_setting_fields_manufacturer ON setting_fields(manufacturer_id); 