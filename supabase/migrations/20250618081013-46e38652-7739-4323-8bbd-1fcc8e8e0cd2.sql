
-- Create table for storing incoming emails
CREATE TABLE public.inbox_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner UUID REFERENCES auth.users NOT NULL,
  recipient_email TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT NOT NULL,
  body_preview TEXT,
  full_body TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.inbox_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for inbox emails
CREATE POLICY "Users can view their own inbox emails" 
  ON public.inbox_emails 
  FOR SELECT 
  USING (auth.uid() = owner);

CREATE POLICY "Users can update their own inbox emails" 
  ON public.inbox_emails 
  FOR UPDATE 
  USING (auth.uid() = owner);

-- Create index for better performance
CREATE INDEX idx_inbox_emails_owner_received ON public.inbox_emails(owner, received_at DESC);
CREATE INDEX idx_inbox_emails_recipient ON public.inbox_emails(recipient_email);
