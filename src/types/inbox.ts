
export interface InboxEmail {
  id: string;
  owner: string;
  recipient_email: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  body_preview?: string;
  full_body?: string;
  received_at: string;
  is_read: boolean;
  created_at: string;
}
