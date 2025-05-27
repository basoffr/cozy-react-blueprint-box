
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import Settings from '@/pages/Settings';

describe('Settings', () => {
  it('renders without crashing', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
