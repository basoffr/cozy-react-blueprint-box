import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Save, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { SequenceProvider, useSequence, SequenceStep } from '@/contexts/SequenceContext';
import { DraggableStep } from './DraggableStep';
import { StepConfigPanel } from './StepConfigPanel';
import { templatesApi, sendersApi } from '@/services/api';
import { PerformanceMonitor, ProfiledComponent } from '@/utils/performance';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mydomain.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SequenceEditorContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, setSteps, addStep, reorderSteps, selectStep, markSaved } = useSequence();
  
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isNewTemplate, setIsNewTemplate] = useState(id === 'new');
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    PerformanceMonitor.logPageLoad('Sequence Editor');
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch template data
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch senders
  const { data: senders, isLoading: sendersLoading } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  // Fetch email templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates?type=email`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  // Load existing sequence
  const { data: existingSequence, isLoading: sequenceLoading } = useQuery({
    queryKey: ['sequence', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/templates/${id}/sequence`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          return { steps: [] };
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Save sequence mutation
  const saveSequenceMutation = useMutation({
    mutationFn: async (steps: SequenceStep[]) => {
      // Validate steps before saving
      const validationErrors = validateSequence(steps);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (isNewTemplate) {
        // Create a new template first
        if (!templateName.trim()) {
          throw new Error('Template name is required');
        }

        const createTemplateResponse = await fetch(`${API_BASE_URL}/api/templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ 
            name: templateName,
            type: 'sequence',
          }),
        });

        if (!createTemplateResponse.ok) {
          const errorData = await createTemplateResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${createTemplateResponse.status}`);
        }

        const newTemplate = await createTemplateResponse.json();
        
        // Now save the sequence with the new template ID
        const saveSequenceResponse = await fetch(`${API_BASE_URL}/api/templates/${newTemplate.id}/sequence`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ steps }),
        });

        if (!saveSequenceResponse.ok) {
          const errorData = await saveSequenceResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${saveSequenceResponse.status}`);
        }

        return saveSequenceResponse.json();
      } else {
        // Update existing template sequence
        const response = await fetch(`${API_BASE_URL}/api/templates/${id}/sequence`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ steps }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return response.json();
      }
    },
    onSuccess: () => {
      toast.success('Sequence saved');
      markSaved();
      // Navigate back to templates
      navigate('/templates');
    },
    onError: (error: any) => {
      console.error('Save sequence error:', error);
      toast.error(error.message || 'Failed to save sequence');
    },
  });

  // Validation function
  const validateSequence = (steps: SequenceStep[]): string[] => {
    const errors: string[] = [];
    
    steps.forEach((step, index) => {
      if (step.type === 'email') {
        if (step.senders.length === 0) {
          errors.push(`Step ${index + 1}: At least one sender is required`);
        }
        if (step.senders.length > 5) {
          errors.push(`Step ${index + 1}: Maximum 5 senders allowed`);
        }
        if (step.templateIds.length === 0) {
          errors.push(`Step ${index + 1}: At least one template is required`);
        }
        if (step.templateIds.length > 3) {
          errors.push(`Step ${index + 1}: Maximum 3 templates allowed per step`);
        }
      }
    });
    
    return errors;
  };

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
    } else if (existingSequence?.steps?.length > 0) {
      setSteps(existingSequence.steps);
    } else if (template && state.steps.length === 0) {
      // Create initial step with the template
      const initialStep: SequenceStep = {
        id: 'initial',
        type: 'email',
        senders: [],
        templateIds: [template.id],
        position: { x: 0, y: 0 },
      };
      setSteps([initialStep]);
    }
  }, [existingSequence, template, setSteps, state.steps.length, isNewTemplate]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveSequence();
      }
      if (e.key === 'Delete' && selectedStepId) {
        // Handle delete in step config panel
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        // TODO: Implement undo functionality
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStepId]);

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

  const handleAddEmailStep = () => {
    const newStep: SequenceStep = {
      id: `step-${Date.now()}`,
      type: 'email',
      senders: [],
      templateIds: [],
    };
    addStep(newStep);
  };

  const handleAddWaitStep = () => {
    const newStep: SequenceStep = {
      id: `step-${Date.now()}`,
      type: 'wait',
      senders: [],
      templateIds: [],
      delayHours: 24,
    };
    addStep(newStep);
  };

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

  const isLoading = templateLoading || sendersLoading || templatesLoading || sequenceLoading;

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
          {/* Header */}
          <div className="bg-white border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4DAF]">
                  {isNewTemplate ? 'Create New Sequence' : 'Sequence Editor'}
                </h1>
                {isNewTemplate && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                      className="px-3 py-2 border rounded-md w-64"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 border rounded-md">
                  <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-sm">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleFitToScreen}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSaveSequence} 
                  disabled={saveSequenceMutation.isPending || !isSequenceValid}
                  className="bg-[#5C4DAF] hover:bg-[#5C4DAF]/90"
                  title={!isSequenceValid ? validationErrors.join(', ') : ''}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveSequenceMutation.isPending ? 'Saving...' : 'Save Sequence'}
                </Button>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b p-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
                onClick={handleAddEmailStep}
              >
                <Plus className="mr-2 h-4 w-4" /> Email
              </Button>
              <Button 
                variant="outline" 
                className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
                onClick={handleAddWaitStep}
              >
                <Plus className="mr-2 h-4 w-4" /> Wait
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex">
            <div 
              className="flex-1 p-6 overflow-auto"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              <div className="max-w-3xl mx-auto space-y-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={state.steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {state.steps.map((step) => (
                      <div key={step.id} className="relative">
                        <DraggableStep
                          step={step}
                          isSelected={step.id === selectedStepId}
                          onSelect={() => handleStepSelect(step.id)}
                          senders={senders || []}
                          templates={templates || []}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
                
                {state.steps.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No steps in your sequence yet.</p>
                    <Button onClick={handleAddEmailStep}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Step
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Step Configuration Panel */}
            {isConfigPanelOpen && selectedStep && (
              <StepConfigPanel
                step={selectedStep}
                senders={senders || []}
                templates={templates || []}
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
