
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SequenceEditorToolbarProps {
  onAddEmailStep: () => void;
  onAddWaitStep: () => void;
}

export const SequenceEditorToolbar: React.FC<SequenceEditorToolbarProps> = ({
  onAddEmailStep,
  onAddWaitStep
}) => {
  return (
    <div className="bg-white border-b p-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
          onClick={onAddEmailStep}
        >
          <Plus className="mr-2 h-4 w-4" /> Email
        </Button>
        <Button 
          variant="outline" 
          className="border-[#5C4DAF] text-[#5C4DAF] hover:bg-[#5C4DAF]/10"
          onClick={onAddWaitStep}
        >
          <Plus className="mr-2 h-4 w-4" /> Wait
        </Button>
      </div>
    </div>
  );
};
