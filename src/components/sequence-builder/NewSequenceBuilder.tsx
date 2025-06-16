
import React, { useEffect } from 'react';
import { SequenceBuilderProvider, useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import { SequenceTopbar } from './SequenceTopbar';
import { SequenceCanvas } from './SequenceCanvas';
import { InspectorPanel } from './InspectorPanel';

interface NewSequenceBuilderProps {
  campaignId?: string;
}

function SequenceBuilderContent({ campaignId }: NewSequenceBuilderProps) {
  const { setSteps } = useSequenceBuilder();

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Load existing sequence steps
    const mockSteps = [
      {
        id: 'step-1',
        type: 'email' as const,
        position: 0,
        subject: 'Welcome to our platform!',
        body: 'Hi {{firstName}}, welcome to our amazing platform...',
        senderId: '1',
        isValid: true,
        errors: []
      }
    ];
    
    if (campaignId) {
      setSteps(mockSteps);
    }
  }, [campaignId, setSteps]);

  const handleToggleActive = (active: boolean) => {
    console.log('Toggle active:', active);
  };

  const handleBack = () => {
    console.log('Navigate back');
  };

  const handleNext = () => {
    console.log('Navigate to next step');
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <SequenceTopbar
        campaignName="Hanneke's campaign"
        isActive={true}
        onToggleActive={handleToggleActive}
        onBack={handleBack}
        onNext={handleNext}
        currentTab="sequence"
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
