
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SequenceBuilderProvider, useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import { SequenceTopbar } from './SequenceTopbar';
import { SequenceCanvas } from './SequenceCanvas';
import { InspectorPanel } from './InspectorPanel';
import { templatesApi } from '@/services/templatesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmptySequence } from '@/utils/sequenceHelpers';

interface NewSequenceBuilderProps {
  mode: 'create' | 'edit';
  templateId?: string;
}

function SequenceBuilderContent({ mode, templateId }: NewSequenceBuilderProps) {
  const { setSteps, setLoading } = useSequenceBuilder();

  // Fetch template data when in edit mode
  const { data: template, isLoading } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => templatesApi.getById(templateId!),
    enabled: mode === 'edit' && !!templateId,
  });

  // Fetch sequence data when in edit mode
  const { data: sequence, isLoading: isLoadingSequence } = useQuery({
    queryKey: ['template-sequence', templateId],
    queryFn: () => templatesApi.getSequence(templateId!),
    enabled: mode === 'edit' && !!templateId,
  });

  useEffect(() => {
    setLoading(isLoading || isLoadingSequence);
  }, [isLoading, isLoadingSequence, setLoading]);

  useEffect(() => {
    if (mode === 'create') {
      // Create empty sequence for new template
      const emptySequence = getEmptySequence();
      setSteps(emptySequence);
    } else if (mode === 'edit' && sequence?.steps) {
      // Load existing sequence steps
      setSteps(sequence.steps);
    }
  }, [mode, sequence, setSteps]);

  const handleToggleActive = (active: boolean) => {
    console.log('Toggle active:', active);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleNext = () => {
    console.log('Navigate to next step');
  };

  if (isLoading || isLoadingSequence) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="space-y-4 w-96">
          <Skeleton className="h-12 w-full bg-slate-700" />
          <Skeleton className="h-64 w-full bg-slate-700" />
          <Skeleton className="h-32 w-full bg-slate-700" />
        </div>
      </div>
    );
  }

  const campaignName = mode === 'edit' ? template?.name || 'Unnamed Template' : 'New Template';

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <SequenceTopbar
        campaignName={campaignName}
        isActive={true}
        onToggleActive={handleToggleActive}
        onBack={handleBack}
        onNext={handleNext}
        currentTab="sequence"
        mode={mode}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <SequenceCanvas />
        <InspectorPanel />
      </div>
    </div>
  );
}

export function NewSequenceBuilder(props: NewSequenceBuilderProps) {
  return (
    <SequenceBuilderProvider>
      <SequenceBuilderContent {...props} />
    </SequenceBuilderProvider>
  );
}
