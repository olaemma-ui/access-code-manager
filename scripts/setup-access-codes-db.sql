-- Create access_ids table
CREATE TABLE IF NOT EXISTS access_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create access_codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  access_id_id UUID NOT NULL REFERENCES access_ids(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'unused', -- 'unused' or 'used'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_access_id ON access_codes(access_id_id);
CREATE INDEX IF NOT EXISTS idx_access_ids_access_id ON access_ids(access_id);
