
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useSequenceBuilder, SequenceStep } from '@/contexts/SequenceBuilderContext';

interface WaitInspectorProps {
  step: SequenceStep;
}

export function WaitInspector({ step }: WaitInspectorProps) {
  const { updateStep } = useSequenceBuilder();

  const handleWaitDaysChange = (value: string) => {
    const days = parseInt(value, 10);
    if (!isNaN(days) && days >= 1 && days <= 30) {
      updateStep(step.id, { waitDays: days });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-200">
          Wait for
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="1"
            max="30"
            value={step.waitDays || 1}
            onChange={(e) => handleWaitDaysChange(e.target.value)}
            className="bg-slate-600 border-slate-500 text-white w-20"
          />
          <span className="text-slate-300">
            {(step.waitDays || 1) === 1 ? 'day' : 'days'}
          </span>
        </div>
        <p className="text-sm text-slate-400">
          How long to wait before the next step in the sequence
        </p>
      </div>
    </div>
  );
}
