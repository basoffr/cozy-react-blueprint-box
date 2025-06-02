
import React, { useState } from 'react';
import { Bell, Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateListItem } from '@/services/templatesApi';

interface OptimizedTemplateRowProps {
  template: TemplateListItem;
  onEditSequence: (id: string) => void;
  onPreview: (id: string) => void;
}

// Memoized template row with areEqual comparison
export const OptimizedTemplateRow = React.memo<OptimizedTemplateRowProps>(({ 
  template, 
  onEditSequence,
  onPreview 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="bg-white border border-gray-200 transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {template.name}
            </h3>
            <p className="text-gray-600 mb-2">{template.subject}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                {template.createdAt ? `Created ${template.createdAt}` : 'Recently created'}
              </span>
              <span>
                {template.length} characters
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {isHovered && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPreview(template.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditSequence(template.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Sequence
            </Button>
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom areEqual function for precise re-render control
  return (
    prevProps.template.id === nextProps.template.id &&
    prevProps.template.name === nextProps.template.name &&
    prevProps.template.subject === nextProps.template.subject &&
    prevProps.template.createdAt === nextProps.template.createdAt &&
    prevProps.template.length === nextProps.template.length
  );
});

OptimizedTemplateRow.displayName = 'OptimizedTemplateRow';
