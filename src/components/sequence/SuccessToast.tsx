
import { useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export const SuccessToast = () => {
  useEffect(() => {
    toast.success('Settings updated – senders ready for sequences');
  }, []);

  return null;
};
