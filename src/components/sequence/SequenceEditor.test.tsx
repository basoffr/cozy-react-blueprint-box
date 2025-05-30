
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import SequenceEditor from './SequenceEditor';

describe('SequenceEditor', () => {
  it('renders without crashing', () => {
    render(<SequenceEditor />);
    expect(screen.getByText('Sequence Editor')).toBeInTheDocument();
  });
});
