
import React from 'react';
import { X, Users, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';

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

  const handleSenderToggle = (senderId: string) => {
    const newSenders = step.senders.includes(senderId)
      ? step.senders.filter(id => id !== senderId)
      : [...step.senders, senderId];
    updateStep(step.id, { senders: newSenders });
  };

  const handleTemplateToggle = (templateId: string) => {
    const newTemplateIds = step.templateIds.includes(templateId)
      ? step.templateIds.filter(id => id !== templateId)
      : [...step.templateIds, templateId];
    
    // Reset distribution when templates change
    const distribution = newTemplateIds.length > 1 
      ? new Array(newTemplateIds.length).fill(100 / newTemplateIds.length)
      : undefined;
    
    updateStep(step.id, { templateIds: newTemplateIds, distribution });
  };

  const handleDistributionChange = (index: number, value: number[]) => {
    const newDistribution = [...(step.distribution || [])];
    newDistribution[index] = value[0];
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
                  Senders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {senders.map((sender) => (
                  <div key={sender.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={step.senders.includes(sender.id)}
                      onCheckedChange={() => handleSenderToggle(sender.id)}
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
                ))}
              </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={step.templateIds.includes(template.id)}
                      onCheckedChange={() => handleTemplateToggle(template.id)}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.subject}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* A/B Distribution */}
            {step.templateIds.length > 1 && step.distribution && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Send Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step.templateIds.map((templateId, index) => {
                    const template = templates.find(t => t.id === templateId);
                    return (
                      <div key={templateId} className="space-y-2">
                        <Label className="text-sm">{template?.name} - {step.distribution?.[index]}%</Label>
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
