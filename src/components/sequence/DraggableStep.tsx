
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Clock, GitBranch, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SequenceStep } from '@/contexts/SequenceContext';

interface DraggableStepProps {
  step: SequenceStep;
  isSelected: boolean;
  onSelect: () => void;
  senders: Array<{ id: string; name: string; email: string }>;
  templates: Array<{ id: string; name: string; subject: string }>;
}

export const DraggableStep: React.FC<DraggableStepProps> = ({
  step,
  isSelected,
  onSelect,
  senders,
  templates,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStepIcon = () => {
    switch (step.type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'wait':
        return <Clock className="h-4 w-4" />;
      case 'branch':
        return <GitBranch className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStepTitle = () => {
    if (step.type === 'email' && step.templateIds.length > 0) {
      const template = templates.find(t => t.id === step.templateIds[0]);
      return template?.subject || 'Email Step';
    }
    if (step.type === 'wait') {
      return `Wait ${step.delayHours || 24} hours`;
    }
    return `${step.type.charAt(0).toUpperCase() + step.type.slice(1)} Step`;
  };

  const isInvalid = step.type === 'email' && step.templateIds.length === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "p-4 border-2 transition-all duration-200",
          isSelected && "border-[#5C4DAF] shadow-md",
          !isSelected && "border-gray-200 hover:border-gray-300",
          isInvalid && "border-red-500 bg-red-50"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              step.type === 'email' && "bg-blue-100 text-blue-600",
              step.type === 'wait' && "bg-orange-100 text-orange-600",
              step.type === 'branch' && "bg-green-100 text-green-600"
            )}>
              {getStepIcon()}
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                {getStepTitle()}
                {isInvalid && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
              <div className="flex gap-2 mt-1">
                {step.senders.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {step.senders.length} sender{step.senders.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {step.templateIds.length > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    {step.templateIds.length} variants
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
