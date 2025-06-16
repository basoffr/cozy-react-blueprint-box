
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useSequenceBuilder, SequenceStep } from '@/contexts/SequenceBuilderContext';
import { sendersApi } from '@/services/api';

interface EmailInspectorProps {
  step: SequenceStep;
}

export function EmailInspector({ step }: EmailInspectorProps) {
  const { updateStep } = useSequenceBuilder();
  const [showCc, setShowCc] = useState(false);
  const [newCcEmail, setNewCcEmail] = useState('');

  // Fetch senders data
  const { data: senders = [] } = useQuery({
    queryKey: ['senders'],
    queryFn: sendersApi.getAll,
  });

  const mergeTagOptions = [
    '{{firstName}}',
    '{{lastName}}',
    '{{company}}',
    '{{email}}',
    '{{website}}',
    '{{picture}}',
  ];

  const handleSubjectChange = (value: string) => {
    updateStep(step.id, { subject: value });
  };

  const handleBodyChange = (value: string) => {
    updateStep(step.id, { body: value });
  };

  const handleSenderChange = (senderId: string) => {
    updateStep(step.id, { senderId });
  };

  const handleManualToggle = (isManual: boolean) => {
    updateStep(step.id, { isManual });
  };

  const addCcEmail = () => {
    if (newCcEmail.trim()) {
      const currentCc = step.ccEmails || [];
      updateStep(step.id, { ccEmails: [...currentCc, newCcEmail.trim()] });
      setNewCcEmail('');
    }
  };

  const removeCcEmail = (email: string) => {
    const currentCc = step.ccEmails || [];
    updateStep(step.id, { ccEmails: currentCc.filter(cc => cc !== email) });
  };

  const insertMergeTag = (tag: string) => {
    const currentBody = step.body || '';
    const newBody = currentBody + tag;
    handleBodyChange(newBody);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Sender Selection */}
      <div className="space-y-2">
        <Label className="text-slate-200">
          Sender for email steps <span className="text-red-400">*</span>
        </Label>
        <Select value={step.senderId || ''} onValueChange={handleSenderChange}>
          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
            <SelectValue placeholder="Select sender" />
          </SelectTrigger>
          <SelectContent className="bg-slate-600 border-slate-500">
            {senders.map((sender: any) => (
              <SelectItem key={sender.id} value={sender.id} className="text-white">
                {sender.name} ({sender.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <Label className="text-slate-200 text-lg font-medium">Content</Label>
        
        {/* Subject */}
        <div className="space-y-2">
          <Label className="text-slate-300">Subject</Label>
          <Input
            value={step.subject || ''}
            onChange={(e) => handleSubjectChange(e.target.value)}
            placeholder="Enter email subject"
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>

        {/* CC Emails */}
        <div className="space-y-2">
          {!showCc ? (
            <Button
              variant="link"
              onClick={() => setShowCc(true)}
              className="text-blue-400 hover:text-blue-300 p-0 h-auto"
            >
              Add Cc
            </Button>
          ) : (
            <div className="space-y-2">
              <Label className="text-slate-300">Cc emails</Label>
              <div className="flex space-x-2">
                <Input
                  value={newCcEmail}
                  onChange={(e) => setNewCcEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  onKeyDown={(e) => e.key === 'Enter' && addCcEmail()}
                />
                <Button onClick={addCcEmail} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {step.ccEmails && step.ccEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {step.ccEmails.map((email, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-600">
                      {email}
                      <button
                        onClick={() => removeCcEmail(email)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Body</Label>
            <Select onValueChange={insertMergeTag}>
              <SelectTrigger className="w-auto bg-slate-600 border-slate-500 text-white">
                <SelectValue placeholder="Insert merge tag" />
              </SelectTrigger>
              <SelectContent className="bg-slate-600 border-slate-500">
                {mergeTagOptions.map(tag => (
                  <SelectItem key={tag} value={tag} className="text-white">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={step.body || ''}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder="Write your email content here..."
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 min-h-32"
          />
        </div>

        {/* Manual Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-slate-300">Mark as manual</Label>
          <Switch
            checked={step.isManual || false}
            onCheckedChange={handleManualToggle}
          />
        </div>
      </div>
    </div>
  );
}
