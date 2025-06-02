
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { templatesApi } from '@/services/templatesApi';

interface TemplatePreviewModalProps {
  templateId: string | null;
  onClose: () => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ 
  templateId, 
  onClose 
}) => {
  const { data: preview, isLoading } = useQuery({
    queryKey: ['template-preview', templateId],
    queryFn: () => templatesApi.getPreview(templateId!),
    enabled: !!templateId,
  });

  return (
    <Dialog open={!!templateId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : preview ? (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: preview.html }}
          />
        ) : (
          <p className="text-gray-500">No preview available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
