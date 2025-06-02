
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';

interface TemplateSelectorProps {
  step: SequenceStep;
  templates: Array<{ id: string; name: string; subject: string }>;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ step, templates }) => {
  const { updateStep } = useSequence();

  const handleTemplateToggle = (templateId: string, checked: boolean) => {
    const newTemplates = checked 
      ? [...step.templateIds, templateId]
      : step.templateIds.filter(id => id !== templateId);
    
    updateStep(step.id, { templateIds: newTemplates });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Selected Templates</h4>
        <div className="flex flex-wrap gap-2">
          {step.templateIds.map(templateId => {
            const template = templates.find(t => t.id === templateId);
            return template ? (
              <Badge key={templateId} variant="secondary">
                {template.name}
              </Badge>
            ) : null;
          })}
          {step.templateIds.length === 0 && (
            <p className="text-sm text-gray-500">No templates selected</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Available Templates</h4>
        <div className="space-y-2">
          {templates.map(template => (
            <div key={template.id} className="flex items-center space-x-2">
              <Checkbox
                checked={step.templateIds.includes(template.id)}
                onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                disabled={!step.templateIds.includes(template.id) && step.templateIds.length >= 3}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-gray-500">{template.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {step.templateIds.length >= 3 && (
        <p className="text-xs text-amber-600">Maximum 3 templates per step</p>
      )}
    </div>
  );
};
