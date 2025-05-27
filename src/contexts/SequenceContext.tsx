
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { produce } from 'immer';

export interface SequenceStep {
  id: string;
  type: 'email' | 'wait' | 'branch';
  senders: string[];
  templateIds: string[];
  distribution?: number[];
  delayHours?: number;
  children?: SequenceStep[];
  position?: { x: number; y: number };
}

interface SequenceState {
  steps: SequenceStep[];
  selectedStepId: string | null;
  isModified: boolean;
  lastSaved: Date | null;
}

type SequenceAction = 
  | { type: 'SET_STEPS'; payload: SequenceStep[] }
  | { type: 'ADD_STEP'; payload: SequenceStep }
  | { type: 'UPDATE_STEP'; payload: { id: string; updates: Partial<SequenceStep> } }
  | { type: 'DELETE_STEP'; payload: string }
  | { type: 'REORDER_STEPS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'SELECT_STEP'; payload: string | null }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_MODIFIED' };

const sequenceReducer = produce((draft: SequenceState, action: SequenceAction) => {
  switch (action.type) {
    case 'SET_STEPS':
      draft.steps = action.payload;
      draft.isModified = false;
      break;
    case 'ADD_STEP':
      draft.steps.push(action.payload);
      draft.isModified = true;
      break;
    case 'UPDATE_STEP':
      const stepIndex = draft.steps.findIndex(s => s.id === action.payload.id);
      if (stepIndex >= 0) {
        Object.assign(draft.steps[stepIndex], action.payload.updates);
        draft.isModified = true;
      }
      break;
    case 'DELETE_STEP':
      draft.steps = draft.steps.filter(s => s.id !== action.payload);
      draft.isModified = true;
      break;
    case 'REORDER_STEPS':
      const [removed] = draft.steps.splice(action.payload.oldIndex, 1);
      draft.steps.splice(action.payload.newIndex, 0, removed);
      draft.isModified = true;
      break;
    case 'SELECT_STEP':
      draft.selectedStepId = action.payload;
      break;
    case 'MARK_SAVED':
      draft.isModified = false;
      draft.lastSaved = new Date();
      break;
    case 'MARK_MODIFIED':
      draft.isModified = true;
      break;
  }
});

interface SequenceContextType {
  state: SequenceState;
  addStep: (step: SequenceStep) => void;
  updateStep: (id: string, updates: Partial<SequenceStep>) => void;
  deleteStep: (id: string) => void;
  reorderSteps: (oldIndex: number, newIndex: number) => void;
  selectStep: (id: string | null) => void;
  setSteps: (steps: SequenceStep[]) => void;
  markSaved: () => void;
  markModified: () => void;
}

const SequenceContext = createContext<SequenceContextType | null>(null);

export const useSequence = () => {
  const context = useContext(SequenceContext);
  if (!context) {
    throw new Error('useSequence must be used within SequenceProvider');
  }
  return context;
};

interface SequenceProviderProps {
  children: React.ReactNode;
}

export const SequenceProvider: React.FC<SequenceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(sequenceReducer, {
    steps: [],
    selectedStepId: null,
    isModified: false,
    lastSaved: null,
  });

  const addStep = useCallback((step: SequenceStep) => {
    dispatch({ type: 'ADD_STEP', payload: step });
  }, []);

  const updateStep = useCallback((id: string, updates: Partial<SequenceStep>) => {
    dispatch({ type: 'UPDATE_STEP', payload: { id, updates } });
  }, []);

  const deleteStep = useCallback((id: string) => {
    dispatch({ type: 'DELETE_STEP', payload: id });
  }, []);

  const reorderSteps = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_STEPS', payload: { oldIndex, newIndex } });
  }, []);

  const selectStep = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_STEP', payload: id });
  }, []);

  const setSteps = useCallback((steps: SequenceStep[]) => {
    dispatch({ type: 'SET_STEPS', payload: steps });
  }, []);

  const markSaved = useCallback(() => {
    dispatch({ type: 'MARK_SAVED' });
  }, []);

  const markModified = useCallback(() => {
    dispatch({ type: 'MARK_MODIFIED' });
  }, []);

  const value = {
    state,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    selectStep,
    setSteps,
    markSaved,
    markModified,
  };

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  );
};
