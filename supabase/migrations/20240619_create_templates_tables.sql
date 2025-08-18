-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    html TEXT NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create template_sequences table
CREATE TABLE IF NOT EXISTS public.template_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(template_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON public.templates(created_at);
CREATE INDEX IF NOT EXISTS idx_template_sequences_template_id ON public.template_sequences(template_id);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sequences ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Users can view their own templates"
    ON public.templates FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own templates"
    ON public.templates FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates"
    ON public.templates FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates"
    ON public.templates FOR DELETE
    USING (auth.uid() = created_by);

-- Create policies for template_sequences
CREATE POLICY "Users can view their own template sequences"
    ON public.template_sequences FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.templates
        WHERE public.templates.id = template_sequences.template_id
        AND public.templates.created_by = auth.uid()
    ));

CREATE POLICY "Users can insert their own template sequences"
    ON public.template_sequences FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.templates
        WHERE public.templates.id = template_sequences.template_id
        AND public.templates.created_by = auth.uid()
    ));

CREATE POLICY "Users can update their own template sequences"
    ON public.template_sequences FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.templates
        WHERE public.templates.id = template_sequences.template_id
        AND public.templates.created_by = auth.uid()
    ));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_sequences_updated_at
BEFORE UPDATE ON public.template_sequences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to check if tables exist (for the Python code)
CREATE OR REPLACE FUNCTION pg_temp.create_tables_if_not_exist()
RETURNS void AS $$
BEGIN
    -- This function will be created in a temporary schema and will be dropped at the end of the session
    -- It's used by the Python code to check if tables exist
    -- The actual table creation is handled by the migration above
    RETURN;
END;
$$ LANGUAGE plpgsql;
