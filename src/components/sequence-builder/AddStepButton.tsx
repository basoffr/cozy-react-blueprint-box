
import React, { useState } from 'react';
import { Plus, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSequenceBuilder } from '@/contexts/SequenceBuilderContext';

interface AddStepButtonProps {
  position: number;
}

export function AddStepButton({ position }: AddStepButtonProps) {
  const { addStep } = useSequenceBuilder();
  const [open, setOpen] = useState(false);

  const handleAddStep = (stepType: 'email' | 'wait') => {
    addStep(stepType, position);
    setOpen(false);
  };

  return (
    <div className="flex justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white border border-slate-500"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-slate-700 border-slate-600" side="right">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-200 hover:bg-slate-600"
              onClick={() => handleAddStep('email')}
            >
              <Mail className="h-4 w-4 mr-2 text-green-500" />
              Email
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-200 hover:bg-slate-600"
              onClick={() => handleAddStep('wait')}
            >
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              Wait
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
