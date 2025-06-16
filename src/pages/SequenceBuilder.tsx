
import { NewSequenceBuilder } from '@/components/sequence-builder/NewSequenceBuilder';
import { useParams } from 'react-router-dom';

const SequenceBuilder = () => {
  const { id } = useParams();
  
  return <NewSequenceBuilder campaignId={id} />;
};

export default SequenceBuilder;
