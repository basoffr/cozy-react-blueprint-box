
import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import { SequenceStepCard } from './SequenceStepCard';
import { AddStepButton } from './AddStepButton';

export function SequenceCanvas() {
  const { state, handleDragEnd } = useSequenceBuilder();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  console.log('SequenceCanvas render:', { 
    stepsCount: state.steps.length, 
    selectedStepId: state.selectedStepId 
  });

  return (
    <div className="flex-1 bg-slate-800 relative overflow-auto">
      {/* Dot grid background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative z-10 p-8">
        <div className="max-w-md mx-auto space-y-4">
          {/* Sequence start */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-600">
              Sequence start
            </div>
            <div className="w-px h-6 bg-slate-600 mt-2"></div>
          </div>

          <AddStepButton position={-1} />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={state.steps.map(step => step.id)} 
              strategy={verticalListSortingStrategy}
            >
              {state.steps
                .sort((a, b) => a.position - b.position)
                .map((step, index) => (
                  <div key={step.id} className="space-y-4">
                    <SequenceStepCard step={step} />
                    <AddStepButton position={index} />
                  </div>
                ))}
            </SortableContext>
          </DndContext>

          {state.steps.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Your sequence is empty</p>
              <p className="text-sm text-slate-500">Add your first step to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
