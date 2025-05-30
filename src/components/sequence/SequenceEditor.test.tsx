
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SequenceEditor from './SequenceEditor';

describe('SequenceEditor', () => {
  it('renders without crashing', () => {
    render(<SequenceEditor />);
    expect(screen.getByText('Sequence Editor')).toBeInTheDocument();
  });
});
