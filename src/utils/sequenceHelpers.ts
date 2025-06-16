
import { SequenceStep } from '@/contexts/SequenceBuilderContext';

export function getEmptySequence(): SequenceStep[] {
  return [
    {
      id: 'step-1',
      type: 'email',
      position: 0,
      subject: '',
      body: '',
      senderId: '',
      isValid: false,
      errors: ['Content is required']
    }
  ];
}

export function validateSequenceStep(step: SequenceStep): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (step.type === 'email') {
    if (!step.subject?.trim()) {
      errors.push('Subject is required');
    }
    if (!step.body?.trim()) {
      errors.push('Body content is required');
    }
    if (!step.senderId) {
      errors.push('Sender is required');
    }
  }
  
  if (step.type === 'wait') {
    if (!step.waitDays || step.waitDays < 1) {
      errors.push('Wait time must be at least 1 day');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
