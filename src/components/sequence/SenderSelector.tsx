
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SequenceStep, useSequence } from '@/contexts/SequenceContext';

interface SenderSelectorProps {
  step: SequenceStep;
  senders: Array<{ id: string; name: string; email: string }>;
}

export const SenderSelector: React.FC<SenderSelectorProps> = ({ step, senders }) => {
  const { updateStep } = useSequence();

  const handleSenderToggle = (senderId: string, checked: boolean) => {
    const newSenders = checked 
      ? [...step.senders, senderId]
      : step.senders.filter(id => id !== senderId);
    
    updateStep(step.id, { senders: newSenders });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Selected Senders</h4>
        <div className="flex flex-wrap gap-2">
          {step.senders.map(senderId => {
            const sender = senders.find(s => s.id === senderId);
            return sender ? (
              <Badge key={senderId} variant="secondary">
                {sender.name}
              </Badge>
            ) : null;
          })}
          {step.senders.length === 0 && (
            <p className="text-sm text-gray-500">No senders selected</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Available Senders</h4>
        <div className="space-y-2">
          {senders.map(sender => (
            <div key={sender.id} className="flex items-center space-x-2">
              <Checkbox
                checked={step.senders.includes(sender.id)}
                onCheckedChange={(checked) => handleSenderToggle(sender.id, !!checked)}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{sender.name}</p>
                <p className="text-xs text-gray-500">{sender.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
