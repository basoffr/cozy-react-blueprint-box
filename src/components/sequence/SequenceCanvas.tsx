
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableStep } from './DraggableStep';
import { SequenceStep } from '@/contexts/SequenceContext';

interface SequenceCanvasProps {
  steps: SequenceStep[];
  selectedStepId: string | null;
  zoom: number;
  onDragEnd: (event: DragEndEvent) => void;
  onStepSelect: (stepId: string) => void;
  onAddEmailStep: () => void;
  senders: Array<{ id: string; name: string; email: string }>;
  templates: Array<{ id: string; name: string; subject: string }>;
}

export const SequenceCanvas: React.FC<SequenceCanvasProps> = ({
  steps,
  selectedStepId,
  zoom,
  onDragEnd,
  onStepSelect,
  onAddEmailStep,
  senders,
  templates
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div 
      className="flex-1 p-6 overflow-auto"
      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <DraggableStep
                  step={step}
                  isSelected={step.id === selectedStepId}
                  onSelect={() => onStepSelect(step.id)}
                  senders={senders}
                  templates={templates}
                />
              </div>
            ))}
          </SortableContext>
        </DndContext>
        
        {steps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No steps in your sequence yet.</p>
            <Button onClick={onAddEmailStep}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
