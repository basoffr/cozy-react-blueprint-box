import React, { useEffect } from 'react';
import { X, Users, Mail, Clock, AlertCircle, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sendersApi } from '@/services/api';

interface StepConfigPanelProps {
  step: SequenceStep;
  senders: Array<{ id: string; name: string; email: string; avatarUrl?: string }>;
  templates: Array<{ id: string; name: string; subject: string }>;
  onClose: () => void;
}

export const StepConfigPanel: React.FC<StepConfigPanelProps> = ({
  step,
  senders,
  templates,
  onClose,
}) => {
  const { updateStep, deleteStep } = useSequence();
  const queryClient = useQueryClient();

  // Listen for sender updates from settings page
  useEffect(() => {
    const handleSenderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
    };

    window.addEventListener('senderUpdated', handleSenderUpdate);
    return () => window.removeEventListener('senderUpdated', handleSenderUpdate);
  }, [queryClient]);

  const handleSenderToggle = (senderId: string) => {
    const newSenders = step.senders.includes(senderId)
      ? step.senders.filter(id => id !== senderId)
      : [...step.senders, senderId];
    
    // Enforce 5-sender limit
    if (newSenders.length > 5) return;
    
    updateStep(step.id, { senders: newSenders });
  };

  const handleTemplateToggle = (templateId: string) => {
    const isCurrentlySelected = step.templateIds.includes(templateId);
    
    if (isCurrentlySelected) {
      // Remove template
      const newTemplateIds = step.templateIds.filter(id => id !== templateId);
      const distribution = newTemplateIds.length > 1 
        ? new Array(newTemplateIds.length).fill(100 / newTemplateIds.length)
        : undefined;
      
      updateStep(step.id, { templateIds: newTemplateIds, distribution });
    } else {
      // Add template (max 3 per step)
      if (step.templateIds.length >= 3) return;
      
      const newTemplateIds = [...step.templateIds, templateId];
      const distribution = newTemplateIds.length > 1 
        ? new Array(newTemplateIds.length).fill(100 / newTemplateIds.length)
        : undefined;
      
      updateStep(step.id, { templateIds: newTemplateIds, distribution });
    }
  };

  const handleDistributionChange = (index: number, value: number[]) => {
    const newDistribution = [...(step.distribution || [])];
    newDistribution[index] = value[0];
    
    // Auto-adjust other values to keep total at 100%
    const total = newDistribution.reduce((sum, val) => sum + val, 0);
    if (total !== 100 && newDistribution.length > 1) {
      const otherIndices = newDistribution.map((_, i) => i).filter(i => i !== index);
      const remaining = 100 - newDistribution[index];
      const perOther = remaining / otherIndices.length;
      otherIndices.forEach(i => {
        newDistribution[i] = perOther;
      });
    }
    
    updateStep(step.id, { distribution: newDistribution });
  };

  const handleDelayChange = (value: string) => {
    const hours = parseInt(value) || 0;
    updateStep(step.id, { delayHours: hours });
  };

  const handleDeleteStep = () => {
    deleteStep(step.id);
    onClose();
  };

  const maxSendersReached = step.senders.length >= 5;
  const maxTemplatesReached = step.templateIds.length >= 3;

  return (
    <div className="w-80 border-l bg-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Configure Step</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {step.type === 'email' && (
          <>
            {/* Senders Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Senders ({step.senders.length}/5)
                </CardTitle>
                {maxSendersReached && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    Max 5 senders reached
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {senders.map((sender) => {
                  const isSelected = step.senders.includes(sender.id);
                  const isDisabled = !isSelected && maxSendersReached;
                  
                  return (
                    <div 
                      key={sender.id} 
                      className={`flex items-center space-x-3 p-2 rounded-lg border ${
                        isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSenderToggle(sender.id)}
                        disabled={isDisabled}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sender.avatarUrl} />
                        <AvatarFallback>
                          {sender.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{sender.name}</div>
                        <div className="text-xs text-gray-500">{sender.email}</div>
                      </div>
                    </div>
                  );
                })}
                {senders.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No senders available. Add senders in Settings.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates ({step.templateIds.length}/3)
                </CardTitle>
                {maxTemplatesReached && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    Max 3 templates per step
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => {
                  const isSelected = step.templateIds.includes(template.id);
                  const isDisabled = !isSelected && maxTemplatesReached;
                  
                  return (
                    <div 
                      key={template.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border ${
                        isSelected ? 'border-green-200 bg-green-50' : 'border-gray-100'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleTemplateToggle(template.id)}
                        disabled={isDisabled}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500 truncate">{template.subject}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* A/B Distribution */}
            {step.templateIds.length > 1 && step.distribution && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step.templateIds.map((templateId, index) => {
                    const template = templates.find(t => t.id === templateId);
                    const percentage = Math.round(step.distribution?.[index] || 0);
                    
                    return (
                      <div key={templateId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">{template?.name}</Label>
                          <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
                        </div>
                        <Slider
                          value={[step.distribution?.[index] || 50]}
                          onValueChange={(value) => handleDistributionChange(index, value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t text-xs text-gray-500">
                    Total: {Math.round((step.distribution || []).reduce((sum, val) => sum + val, 0))}%
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {step.type === 'wait' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Delay Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="delay-hours">Hours to wait</Label>
                <Input
                  id="delay-hours"
                  type="number"
                  value={step.delayHours || 24}
                  onChange={(e) => handleDelayChange(e.target.value)}
                  min="1"
                  max="8760"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Errors */}
        {step.type === 'email' && step.senders.length === 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                At least one sender is required
              </p>
            </CardContent>
          </Card>
        )}

        {step.type === 'email' && step.templateIds.length === 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                At least one template is required
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delete Step */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteStep}
          className="w-full"
        >
          Delete Step
        </Button>
      </div>
    </div>
  );
};
