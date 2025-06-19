
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSequenceBuilder } from '@/contexts/SequenceBuilderContext';
import { EmailInspector } from './EmailInspector';
import { WaitInspector } from './WaitInspector';

export function InspectorPanel() {
  const { state, selectStep, updateStep } = useSequenceBuilder();
  const selectedStep = state.steps.find(step => step.id === state.selectedStepId);

  console.log('InspectorPanel render:', { 
    selectedStepId: state.selectedStepId, 
    selectedStep: selectedStep,
    totalSteps: state.steps.length 
  });

  const handleSave = () => {
    if (selectedStep) {
      // Force a re-validation/save of the current step
      updateStep(selectedStep.id, {});
      console.log('Step saved:', selectedStep.id);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
      <AnimatePresence mode="wait">
        {selectedStep ? (
          <motion.div
            key="inspector-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  {selectedStep.type === 'email' ? (
                    <Mail className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {selectedStep.type === 'email' ? 'Email Step' : 'Wait Step'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configure your {selectedStep.type} settings
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectStep(null)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {selectedStep.type === 'email' && <EmailInspector step={selectedStep} />}
                {selectedStep.type === 'wait' && <WaitInspector step={selectedStep} />}
              </div>
            </div>

            {/* Footer with Save Button */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {selectedStep.isValid ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Configuration valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Missing required fields</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
              {selectedStep.errors && selectedStep.errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">Please fix the following issues:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedStep.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-center flex-1 p-8 text-center">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-slate-700 text-xl font-semibold">No step selected</div>
                  <p className="text-slate-500 max-w-xs">
                    Click on any step in your sequence to configure its settings and content
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
