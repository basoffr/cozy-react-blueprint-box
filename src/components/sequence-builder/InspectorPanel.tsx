
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import { EmailInspector } from './EmailInspector';
import { WaitInspector } from './WaitInspector';

export function InspectorPanel() {
  const { state, selectStep } = useSequenceBuilder();
  const selectedStep = state.steps.find(step => step.id === state.selectedStepId);

  return (
    <AnimatePresence>
      {selectedStep && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-80 bg-slate-700 border-l border-slate-600 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-600">
            <h2 className="text-white font-semibold">
              {selectedStep.type === 'email' ? 'Email Settings' : 'Wait Settings'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectStep(null)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {selectedStep.type === 'email' && <EmailInspector step={selectedStep} />}
            {selectedStep.type === 'wait' && <WaitInspector step={selectedStep} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
