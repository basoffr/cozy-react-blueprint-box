
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { templatesApi } from '@/services/templatesApi';
import DOMPurify from 'dompurify';

// Create a safe HTML component that uses a ref instead of dangerouslySetInnerHTML
const SafeHTML: React.FC<{ html: string; className?: string }> = ({ html, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (containerRef.current) {
      // Sanitize the HTML content before inserting it
      const sanitizedHTML = DOMPurify.sanitize(html, {
        // Allow common email template elements but restrict script execution
        ALLOWED_TAGS: ['p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'div', 'span', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
        ALLOWED_ATTR: ['href', 'target', 'style', 'class', 'src', 'alt', 'width', 'height', 'border', 'cellpadding', 'cellspacing']
      });
      containerRef.current.innerHTML = sanitizedHTML;
    }
  }, [html]);
  
  return <div ref={containerRef} className={className} />;
};

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
          <SafeHTML 
            html={preview.html}
            className="prose max-w-none"
          />
        ) : (
          <p className="text-gray-500">No preview available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
