
-- Create table for email server configurations
CREATE TABLE public.email_servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner UUID REFERENCES auth.users NOT NULL,
  email_address TEXT NOT NULL,
  password TEXT NOT NULL,
  pop_imap_server TEXT NOT NULL,
  smtp_server TEXT NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  use_ssl BOOLEAN NOT NULL DEFAULT true,
  use_tls BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.email_servers ENABLE ROW LEVEL SECURITY;

-- Create policies for email servers
CREATE POLICY "Users can view their own email servers" 
  ON public.email_servers 
  FOR SELECT 
  USING (auth.uid() = owner);

CREATE POLICY "Users can insert their own email servers" 
  ON public.email_servers 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own email servers" 
  ON public.email_servers 
  FOR UPDATE 
  USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own email servers" 
  ON public.email_servers 
  FOR DELETE 
  USING (auth.uid() = owner);

-- Create trigger for updated_at
CREATE TRIGGER set_email_servers_updated_at
  BEFORE UPDATE ON public.email_servers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create index for better performance
CREATE INDEX idx_email_servers_owner ON public.email_servers(owner);
CREATE UNIQUE INDEX idx_email_servers_owner_default ON public.email_servers(owner) WHERE is_default = true;
