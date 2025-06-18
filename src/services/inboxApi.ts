
import { supabase } from "@/integrations/supabase/client";
import type { InboxEmail } from "@/types/inbox";

export const inboxApi = {
  async getAll(): Promise<InboxEmail[]> {
    const { data, error } = await supabase
      .from('inbox_emails')
      .select('*')
      .order('received_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getRecipients(): Promise<string[]> {
    const { data, error } = await supabase
      .from('inbox_emails')
      .select('recipient_email')
      .order('recipient_email');
    
    if (error) throw error;
    
    const uniqueRecipients = [...new Set(data?.map(item => item.recipient_email) || [])];
    return uniqueRecipients;
  },

  async markAsRead(emailId: string): Promise<void> {
    const { error } = await supabase
      .from('inbox_emails')
      .update({ is_read: true })
      .eq('id', emailId);
    
    if (error) throw error;
  },

  async markAsUnread(emailId: string): Promise<void> {
    const { error } = await supabase
      .from('inbox_emails')
      .update({ is_read: false })
      .eq('id', emailId);
    
    if (error) throw error;
  }
};
