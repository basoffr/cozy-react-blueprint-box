
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SequenceEditor from './SequenceEditor';

describe('SequenceEditor', () => {
  it('renders without crashing', () => {
    const { container } = render(<SequenceEditor />);
    expect(container).toBeInTheDocument();
  });
});
