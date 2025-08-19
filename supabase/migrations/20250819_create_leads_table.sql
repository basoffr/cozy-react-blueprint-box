-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    bedrijf VARCHAR(255),
    website VARCHAR(255),
    linkedin VARCHAR(255), 
    image_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leads
CREATE POLICY "Users can only see their own leads" ON leads
    FOR SELECT USING (auth.uid() = owner);

CREATE POLICY "Users can only insert their own leads" ON leads
    FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can only update their own leads" ON leads
    FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY "Users can only delete their own leads" ON leads
    FOR DELETE USING (auth.uid() = owner);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add some comments for documentation
COMMENT ON TABLE leads IS 'Lead management table for storing contact information';
COMMENT ON COLUMN leads.owner IS 'User who owns this lead';
COMMENT ON COLUMN leads.email IS 'Primary email address of the lead';
COMMENT ON COLUMN leads.bedrijf IS 'Company name of the lead';
COMMENT ON COLUMN leads.website IS 'Website URL of the lead or company';
COMMENT ON COLUMN leads.linkedin IS 'LinkedIn profile URL of the lead';
COMMENT ON COLUMN leads.image_path IS 'Path to profile image or company logo';
