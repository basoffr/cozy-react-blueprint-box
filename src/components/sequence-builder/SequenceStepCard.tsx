
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Clock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSequenceBuilder, SequenceStep } from '@/contexts/SequenceBuilderContext';
import { cn } from '@/lib/utils';

interface SequenceStepCardProps {
  step: SequenceStep;
}

export function SequenceStepCard({ step }: SequenceStepCardProps) {
  const { state, selectStep, deleteStep } = useSequenceBuilder();
  const isSelected = state.selectedStepId === step.id;
  
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
        return <Mail className="h-5 w-5 text-white" />;
      case 'wait':
        return <Clock className="h-5 w-5 text-white" />;
      default:
        return <Mail className="h-5 w-5 text-white" />;
    }
  };

  const getStepTitle = () => {
    switch (step.type) {
      case 'email':
        return 'Email';
      case 'wait':
        return `Wait for ${step.waitDays || 1} ${(step.waitDays || 1) === 1 ? 'day' : 'days'}`;
      default:
        return 'Unknown';
    }
  };

  const getStepContent = () => {
    if (step.type === 'email') {
      if (!step.isValid) {
        return (
          <p className="text-red-400 text-sm">Content is required</p>
        );
      }
      return (
        <div className="space-y-1">
          {step.subject && (
            <p className="text-sm text-slate-300 truncate">Subject: {step.subject}</p>
          )}
          {step.body && (
            <p className="text-xs text-slate-400 truncate">
              {step.body.slice(0, 50)}...
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent event if dragging
    if (isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    console.log('Card clicked, selecting step:', step.id);
    selectStep(step.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteStep(step.id);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectStep(step.id);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-6 bg-slate-600"></div>
      
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-slate-700 border-2 rounded-lg p-4 w-full max-w-sm transition-all duration-200 cursor-pointer",
          isSelected ? "border-blue-500 bg-slate-600" : "border-slate-600 hover:border-slate-500",
          !step.isValid && step.type === 'email' && "border-red-500",
          isDragging && "opacity-50 scale-105"
        )}
        onClick={handleCardClick}
        {...attributes}
      >
        {/* Drag handle - separate from click area */}
        <div 
          {...listeners}
          className="absolute top-2 right-2 w-4 h-4 cursor-grab opacity-50 hover:opacity-100"
        >
          <div className="w-full h-full bg-slate-500 rounded"></div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={cn(
              "p-2 rounded-lg",
              step.type === 'email' ? "bg-green-600" : "bg-blue-600"
            )}>
              {getStepIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm">
                {getStepTitle()}
              </h3>
              {getStepContent()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-px h-6 bg-slate-600 mt-2"></div>
    </div>
  );
}
