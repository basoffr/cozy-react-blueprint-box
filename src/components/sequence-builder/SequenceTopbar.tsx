
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SequenceTopbarProps {
  campaignName: string;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  currentTab: 'sequence' | 'leads' | 'launch';
}

export function SequenceTopbar({ 
  campaignName, 
  isActive, 
  onToggleActive, 
  onBack, 
  onNext,
  currentTab 
}: SequenceTopbarProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Breadcrumb and status */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-white">{campaignName}</h1>
            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
              1
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">
              {isActive ? 'Active' : 'Paused'}
            </span>
            <Switch 
              checked={isActive} 
              onCheckedChange={onToggleActive}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>

        {/* Center - Tabs */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${currentTab === 'sequence' ? 'text-white' : 'text-slate-400'}`}>
              Sequence
            </span>
            {currentTab === 'sequence' && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${currentTab === 'leads' ? 'text-white' : 'text-slate-400'}`}>
              Lead list
            </span>
            {currentTab === 'leads' && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${currentTab === 'launch' ? 'text-white' : 'text-slate-400'}`}>
              Launch
            </span>
            {currentTab === 'launch' && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        </div>

        {/* Right side - Next button */}
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-white">
          Next step
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
