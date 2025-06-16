
import { NewSequenceBuilder } from '@/components/sequence-builder/NewSequenceBuilder';
import { useParams } from 'react-router-dom';

interface SequenceBuilderProps {
  mode: 'create' | 'edit';
}

const SequenceBuilder = ({ mode }: SequenceBuilderProps) => {
  const { templateId } = useParams();
  
  return <NewSequenceBuilder mode={mode} templateId={templateId} />;
};

export default SequenceBuilder;
