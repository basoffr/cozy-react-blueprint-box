
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

export interface SequenceStep {
  id: string;
  type: 'email' | 'wait' | 'manual' | 'conditional';
  position: number;
  // Email step properties
  senderId?: string;
  subject?: string;
  body?: string;
  ccEmails?: string[];
  isManual?: boolean;
  // Wait step properties
  waitDays?: number;
  waitHours?: number;
  // Validation
  isValid?: boolean;
  errors?: string[];
}

export interface SequenceBuilderState {
  steps: SequenceStep[];
  selectedStepId: string | null;
  isDirty: boolean;
  isLoading: boolean;
}

type SequenceBuilderAction =
  | { type: 'SET_STEPS'; payload: SequenceStep[] }
  | { type: 'ADD_STEP'; payload: { stepType: 'email' | 'wait'; afterPosition: number } }
  | { type: 'UPDATE_STEP'; payload: { id: string; updates: Partial<SequenceStep> } }
  | { type: 'DELETE_STEP'; payload: string }
  | { type: 'REORDER_STEPS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'SELECT_STEP'; payload: string | null }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: SequenceBuilderState = {
  steps: [],
  selectedStepId: null,
  isDirty: false,
  isLoading: false,
};

function validateStep(step: SequenceStep): { isValid: boolean; errors: string[] } {
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

function sequenceBuilderReducer(state: SequenceBuilderState, action: SequenceBuilderAction): SequenceBuilderState {
  switch (action.type) {
    case 'SET_STEPS': {
      // Validate all steps when setting
      const validatedSteps = action.payload.map(step => {
        const validation = validateStep(step);
        return { ...step, ...validation };
      });
      return { ...state, steps: validatedSteps };
    }
    
    case 'ADD_STEP': {
      const newStep: SequenceStep = {
        id: `step-${Date.now()}`,
        type: action.payload.stepType,
        position: action.payload.afterPosition + 1,
        ...(action.payload.stepType === 'email' && {
          subject: '',
          body: '',
          senderId: '',
          isValid: false,
          errors: ['Content is required']
        }),
        ...(action.payload.stepType === 'wait' && {
          waitDays: 1,
          isValid: true,
          errors: []
        })
      };
      
      const updatedSteps = [...state.steps];
      // Update positions of steps after insertion point
      updatedSteps.forEach(step => {
        if (step.position > action.payload.afterPosition) {
          step.position += 1;
        }
      });
      updatedSteps.push(newStep);
      updatedSteps.sort((a, b) => a.position - b.position);
      
      return { 
        ...state, 
        steps: updatedSteps, 
        selectedStepId: newStep.id,
        isDirty: true 
      };
    }
    
    case 'UPDATE_STEP': {
      const updatedSteps = state.steps.map(step => {
        if (step.id === action.payload.id) {
          const updated = { ...step, ...action.payload.updates };
          const validation = validateStep(updated);
          return { ...updated, ...validation };
        }
        return step;
      });
      return { ...state, steps: updatedSteps, isDirty: true };
    }
    
    case 'DELETE_STEP': {
      const filteredSteps = state.steps.filter(step => step.id !== action.payload);
      // Reorder positions
      filteredSteps.forEach((step, index) => {
        step.position = index;
      });
      return { 
        ...state, 
        steps: filteredSteps, 
        selectedStepId: state.selectedStepId === action.payload ? null : state.selectedStepId,
        isDirty: true 
      };
    }
    
    case 'REORDER_STEPS': {
      const newSteps = [...state.steps];
      const [removed] = newSteps.splice(action.payload.oldIndex, 1);
      newSteps.splice(action.payload.newIndex, 0, removed);
      // Update positions
      newSteps.forEach((step, index) => {
        step.position = index;
      });
      return { ...state, steps: newSteps, isDirty: true };
    }
    
    case 'SELECT_STEP':
      return { ...state, selectedStepId: action.payload };
    
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

interface SequenceBuilderContextType {
  state: SequenceBuilderState;
  addStep: (stepType: 'email' | 'wait', afterPosition: number) => void;
  updateStep: (id: string, updates: Partial<SequenceStep>) => void;
  deleteStep: (id: string) => void;
  selectStep: (id: string | null) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  setSteps: (steps: SequenceStep[]) => void;
  setLoading: (loading: boolean) => void;
}

const SequenceBuilderContext = createContext<SequenceBuilderContextType | undefined>(undefined);

export function useSequenceBuilder() {
  const context = useContext(SequenceBuilderContext);
  if (!context) {
    throw new Error('useSequenceBuilder must be used within a SequenceBuilderProvider');
  }
  return context;
}

interface SequenceBuilderProviderProps {
  children: ReactNode;
}

export function SequenceBuilderProvider({ children }: SequenceBuilderProviderProps) {
  const [state, dispatch] = useReducer(sequenceBuilderReducer, initialState);

  const addStep = (stepType: 'email' | 'wait', afterPosition: number) => {
    dispatch({ type: 'ADD_STEP', payload: { stepType, afterPosition } });
  };

  const updateStep = (id: string, updates: Partial<SequenceStep>) => {
    dispatch({ type: 'UPDATE_STEP', payload: { id, updates } });
  };

  const deleteStep = (id: string) => {
    dispatch({ type: 'DELETE_STEP', payload: id });
  };

  const selectStep = (id: string | null) => {
    dispatch({ type: 'SELECT_STEP', payload: id });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.steps.findIndex(step => step.id === active.id);
      const newIndex = state.steps.findIndex(step => step.id === over.id);
      dispatch({ type: 'REORDER_STEPS', payload: { oldIndex, newIndex } });
    }
  };

  const setSteps = (steps: SequenceStep[]) => {
    dispatch({ type: 'SET_STEPS', payload: steps });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
    <SequenceBuilderContext.Provider
      value={{
        state,
        addStep,
        updateStep,
        deleteStep,
        selectStep,
        handleDragEnd,
        setSteps,
        setLoading,
      }}
    >
      {children}
    </SequenceBuilderContext.Provider>
  );
}
