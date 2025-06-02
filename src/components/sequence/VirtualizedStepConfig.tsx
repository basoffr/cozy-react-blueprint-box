
import React, { Suspense, lazy, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X, Settings } from 'lucide-react';
import { SequenceStep } from '@/contexts/SequenceContext';

// Lazy load heavy components
const SenderSelector = lazy(() => import('./SenderSelector').then(module => ({ default: module.SenderSelector })));
const TemplateSelector = lazy(() => import('./TemplateSelector').then(module => ({ default: module.TemplateSelector })));

interface VirtualizedStepConfigProps {
  step: SequenceStep;
  senders: Array<{ id: string; name: string; email: string }>;
  templates: Array<{ id: string; name: string; subject: string }>;
  onClose: () => void;
}

export const VirtualizedStepConfig: React.FC<VirtualizedStepConfigProps> = ({
  step,
  senders,
  templates,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'senders' | 'templates' | 'settings'>('senders');

  const TabSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-3/4" />
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Step Configuration</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-1 mt-4">
          <Button
            variant={activeTab === 'senders' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('senders')}
          >
            Senders
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'senders' && (
          <Suspense fallback={<TabSkeleton />}>
            <SenderSelector step={step} senders={senders} />
          </Suspense>
        )}
        
        {activeTab === 'templates' && (
          <Suspense fallback={<TabSkeleton />}>
            <TemplateSelector step={step} templates={templates} />
          </Suspense>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Step Type</label>
              <p className="text-sm text-gray-600 capitalize">{step.type}</p>
            </div>
            {step.type === 'wait' && (
              <div>
                <label className="block text-sm font-medium mb-2">Delay (hours)</label>
                <input
                  type="number"
                  value={step.delayHours || 24}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  max="168"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
