
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Play, Settings } from 'lucide-react';

interface SequenceTopbarProps {
  campaignName: string;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  currentTab: string;
  mode?: 'create' | 'edit';
}

export function SequenceTopbar({
  campaignName,
  isActive,
  onToggleActive,
  onBack,
  onNext,
  currentTab,
  mode = 'edit'
}: SequenceTopbarProps) {
  const title = mode === 'create' ? 'New Sequence' : `Edit: ${campaignName}`;

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          
          <div className="text-white font-medium">{title}</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 text-sm">Active</span>
            <Switch
              checked={isActive}
              onCheckedChange={onToggleActive}
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onNext}
          >
            <Play className="h-4 w-4 mr-2" />
            {mode === 'create' ? 'Save Template' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
