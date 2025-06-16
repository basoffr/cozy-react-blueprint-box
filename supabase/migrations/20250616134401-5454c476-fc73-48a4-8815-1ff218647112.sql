
-- Step variants table for A/B testing support
CREATE TABLE IF NOT EXISTS public.step_variants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id        UUID REFERENCES public.campaign_steps(id) ON DELETE CASCADE,
  variant_idx    INT CHECK (variant_idx BETWEEN 1 AND 3),
  weight_percent INT DEFAULT 100 CHECK (weight_percent BETWEEN 0 AND 100),
  subject        TEXT,
  html           TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure unique variant index per step
CREATE UNIQUE INDEX IF NOT EXISTS ux_step_variant_idx 
  ON step_variants(step_id, variant_idx);

-- Add trigger for updated_at
CREATE TRIGGER set_step_variants_updated_at
  BEFORE UPDATE ON step_variants
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
