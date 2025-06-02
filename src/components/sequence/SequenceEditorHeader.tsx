
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SequenceEditorHeaderProps {
  isNewTemplate: boolean;
  templateName: string;
  setTemplateName: (name: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSequenceValid: boolean;
  validationErrors: string[];
}

export const SequenceEditorHeader: React.FC<SequenceEditorHeaderProps> = ({
  isNewTemplate,
  templateName,
  setTemplateName,
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onSave,
  isSaving,
  isSequenceValid,
  validationErrors
}) => {
  return (
    <div className="bg-white border-b p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5C4DAF]">
            {isNewTemplate ? 'Create New Sequence' : 'Sequence Editor'}
          </h1>
          {isNewTemplate && (
            <div className="mt-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="px-3 py-2 border rounded-md w-64"
                required
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 border rounded-md">
            <Button variant="ghost" size="sm" onClick={onZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm">{zoom}%</span>
            <Button variant="ghost" size="sm" onClick={onZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onFitToScreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={onSave} 
            disabled={isSaving || !isSequenceValid}
            className="bg-[#5C4DAF] hover:bg-[#5C4DAF]/90"
            title={!isSequenceValid ? validationErrors.join(', ') : ''}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Sequence'}
          </Button>
        </div>
      </div>
    </div>
  );
};
