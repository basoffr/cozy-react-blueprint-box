
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { Skeleton } from '@/components/ui/skeleton';
import { SequenceProvider, useSequence, SequenceStep } from '@/contexts/SequenceContext';
import { VirtualizedStepConfig } from './VirtualizedStepConfig';
import { SequenceEditorHeader } from './SequenceEditorHeader';
import { SequenceEditorToolbar } from './SequenceEditorToolbar';
import { SequenceCanvas } from './SequenceCanvas';
import { useDebouncedDragHandler } from './DebouncedDragHandler';
import { useSequenceData } from '@/hooks/useSequenceData';
import { useSequenceOperations } from '@/hooks/useSequenceOperations';
import { PerformanceMonitor, ProfiledComponent } from '@/utils/performance';

interface SequenceData {
  steps: SequenceStep[];
}

interface Sender {
  id: string;
  name: string;
  email: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
}

const SequenceEditorContent = () => {
  const { id } = useParams<{ id: string }>();
  const { state, setSteps, reorderSteps, selectStep, updateStep } = useSequence();
  
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isNewTemplate, setIsNewTemplate] = useState(id === 'new');
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    PerformanceMonitor.logPageLoad('Sequence Editor');
  }, []);

  // Initialize debounced drag handler
  const { handleDragMove } = useDebouncedDragHandler({
    onStepUpdate: updateStep,
    debounceMs: 250
  });

  // Fetch data
  const { template, senders, templates, existingSequence, isLoading } = useSequenceData(id);

  // Operations
  const { saveSequenceMutation, validateSequence, handleAddEmailStep, handleAddWaitStep } = useSequenceOperations(id, isNewTemplate, templateName);

  // Auto-save every 15 seconds
  useEffect(() => {
    if (!state.isModified) return;

    const interval = setInterval(() => {
      if (state.isModified) {
        saveSequenceMutation.mutate(state.steps);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [state.isModified, state.steps, saveSequenceMutation]);

  // Initialize sequence from existing data or create a new one
  useEffect(() => {
    if (isNewTemplate) {
      // Create initial empty step for new template
      const initialStep: SequenceStep = {
        id: 'initial',
        type: 'email',
        senders: [],
        templateIds: [],
        position: { x: 0, y: 0 },
      };
      setSteps([initialStep]);
    } else if ((existingSequence as SequenceData)?.steps?.length > 0) {
      setSteps((existingSequence as SequenceData).steps);
    } else if ((template as Template) && state.steps.length === 0) {
      // Create initial step with the template
      const initialStep: SequenceStep = {
        id: 'initial',
        type: 'email',
        senders: [],
        templateIds: [(template as Template).id],
        position: { x: 0, y: 0 },
      };
      setSteps([initialStep]);
    }
  }, [existingSequence, template, setSteps, state.steps.length, isNewTemplate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    PerformanceMonitor.startMeasurement('drag-reorder');
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = state.steps.findIndex(step => step.id === active.id);
      const newIndex = state.steps.findIndex(step => step.id === over.id);
      reorderSteps(oldIndex, newIndex);
    }
    PerformanceMonitor.endMeasurement('drag-reorder');
  }, [state.steps, reorderSteps]);

  const handleStepSelect = (stepId: string) => {
    PerformanceMonitor.startMeasurement('step-select');
    setSelectedStepId(stepId);
    setIsConfigPanelOpen(true);
    selectStep(stepId);
    PerformanceMonitor.endMeasurement('step-select');
  };

  const handleSaveSequence = () => {
    saveSequenceMutation.mutate(state.steps);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleFitToScreen = () => setZoom(100);

  // Check if sequence is valid for launch
  const validationErrors = validateSequence(state.steps);
  const isSequenceValid = validationErrors.length === 0;

  if (isLoading) {
    return (
      <ProfiledComponent id="sequence-skeleton">
        <div className="min-h-screen flex w-full bg-gray-50">
          <div className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </ProfiledComponent>
    );
  }

  const selectedStep = selectedStepId ? state.steps.find(s => s.id === selectedStepId) : null;

  return (
    <ProfiledComponent id="sequence-editor">
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1 flex flex-col">
          <SequenceEditorHeader
            isNewTemplate={isNewTemplate}
            templateName={templateName}
            setTemplateName={setTemplateName}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitToScreen={handleFitToScreen}
            onSave={handleSaveSequence}
            isSaving={saveSequenceMutation.isPending}
            isSequenceValid={isSequenceValid}
            validationErrors={validationErrors}
          />

          <SequenceEditorToolbar
            onAddEmailStep={handleAddEmailStep}
            onAddWaitStep={handleAddWaitStep}
          />

          <div className="flex-1 flex">
            <SequenceCanvas
              steps={state.steps}
              selectedStepId={selectedStepId}
              zoom={zoom}
              onDragEnd={handleDragEnd}
              onStepSelect={handleStepSelect}
              onAddEmailStep={handleAddEmailStep}
              senders={(senders as Sender[]) || []}
              templates={(templates as Template[]) || []}
            />

            {isConfigPanelOpen && selectedStep && (
              <VirtualizedStepConfig
                step={selectedStep}
                senders={(senders as Sender[]) || []}
                templates={(templates as Template[]) || []}
                onClose={() => {
                  setIsConfigPanelOpen(false);
                  setSelectedStepId(null);
                  selectStep(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </ProfiledComponent>
  );
};

const SequenceEditor = () => {
  return (
    <SequenceProvider>
      <SequenceEditorContent />
    </SequenceProvider>
  );
};

export default SequenceEditor;
