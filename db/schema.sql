-- Create verification_codes table
CREATE TABLE verification_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- New tables for FFB settings
CREATE TABLE ffb_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  car VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  discipline VARCHAR(50) NOT NULL,
  likes INTEGER DEFAULT 0,
  is_manufacturer_provided BOOLEAN DEFAULT FALSE,
  strength INTEGER NOT NULL,
  damping INTEGER NOT NULL,
  minimum_force INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX idx_ffb_settings_brand ON ffb_settings(brand);
CREATE INDEX idx_ffb_settings_model ON ffb_settings(model);
CREATE INDEX idx_ffb_settings_discipline ON ffb_settings(discipline); 