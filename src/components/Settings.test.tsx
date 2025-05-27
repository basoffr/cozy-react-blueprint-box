
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsContent } from './SettingsContent';

// Mock the API calls
vi.mock('@/services/api', () => ({
  sendersApi: {
    getAll: vi.fn(() => Promise.resolve([
      { id: '1', name: 'John Doe', email: 'john@example.com', daily_quota: 100 }
    ])),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SettingsContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the settings tabs', async () => {
    render(<SettingsContent />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Email Senders')).toBeInTheDocument();
    expect(screen.getByText('SMTP & API Keys')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('shows add sender button', async () => {
    render(<SettingsContent />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /add sender/i })).toBeInTheDocument();
  });

  it('opens sender modal when add sender is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsContent />, { wrapper: createWrapper() });
    
    const addButton = screen.getByRole('button', { name: /add sender/i });
    await user.click(addButton);
    
    expect(screen.getByText('Add New Sender')).toBeInTheDocument();
  });

  it('displays senders list', async () => {
    render(<SettingsContent />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('validates form fields', async () => {
    const user = userEvent.setup();
    render(<SettingsContent />, { wrapper: createWrapper() });
    
    const addButton = screen.getByRole('button', { name: /add sender/i });
    await user.click(addButton);
    
    const createButton = screen.getByRole('button', { name: /create sender/i });
    await user.click(createButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
