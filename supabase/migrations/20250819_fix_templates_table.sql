-- Fix templates table schema issues
-- Add missing columns if they don't exist

-- Add name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'name') THEN
        ALTER TABLE public.templates ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Template';
        RAISE NOTICE 'Added name column to templates table';
    END IF;
END $$;

-- Add subject column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'subject') THEN
        ALTER TABLE public.templates ADD COLUMN subject TEXT NOT NULL DEFAULT 'No Subject';
        RAISE NOTICE 'Added subject column to templates table';
    END IF;
END $$;

-- Add html column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'html') THEN
        ALTER TABLE public.templates ADD COLUMN html TEXT NOT NULL DEFAULT '<p>Empty template</p>';
        RAISE NOTICE 'Added html column to templates table';
    END IF;
END $$;

-- Add created_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'created_by') THEN
        ALTER TABLE public.templates ADD COLUMN created_by UUID NOT NULL DEFAULT auth.uid();
        RAISE NOTICE 'Added created_by column to templates table';
    END IF;
END $$;

-- Add timestamps if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'created_at') THEN
        ALTER TABLE public.templates ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to templates table';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'templates' AND column_name = 'updated_at') THEN
        ALTER TABLE public.templates ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to templates table';
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies if they don't exist
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own templates" ON public.templates;
    DROP POLICY IF EXISTS "Users can insert their own templates" ON public.templates;
    DROP POLICY IF EXISTS "Users can update their own templates" ON public.templates;
    DROP POLICY IF EXISTS "Users can delete their own templates" ON public.templates;
    
    -- Create policies
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
        
    RAISE NOTICE 'Recreated RLS policies for templates table';
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON public.templates(created_at);
