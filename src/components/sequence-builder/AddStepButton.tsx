
import React, { useState } from 'react';
import { Plus, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AddStepButtonProps {
  position: number;
}

export function AddStepButton({ position }: AddStepButtonProps) {
  const { addStep } = useSequenceBuilder();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddStep = (stepType: 'email' | 'wait') => {
    console.log('AddStepButton: Adding step:', stepType, 'at position:', position);
    console.log('AddStepButton: addStep function exists:', typeof addStep);
    try {
      addStep(stepType, position);
      console.log('AddStepButton: addStep called successfully');
    } catch (error) {
      console.error('AddStepButton: Error calling addStep:', error);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-slate-600 hover:bg-slate-500 border border-slate-500 transition-all duration-200 hover:scale-110"
          >
            <Plus className="h-4 w-4 text-slate-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="bg-slate-700 border-slate-600 text-white"
        >
          <DropdownMenuItem 
            onClick={() => handleAddStep('email')}
            className="hover:bg-slate-600 cursor-pointer"
          >
            <Mail className="h-4 w-4 mr-2 text-green-500" />
            Add Email
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleAddStep('wait')}
            className="hover:bg-slate-600 cursor-pointer"
          >
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Add Wait
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
