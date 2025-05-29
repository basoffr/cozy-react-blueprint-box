
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Settings from '@/pages/Settings';

describe('Settings', () => {
  it('renders without crashing', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
