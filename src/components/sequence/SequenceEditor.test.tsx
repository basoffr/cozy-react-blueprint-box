
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import SequenceEditor from './SequenceEditor';

// Mock the API calls
vi.mock('@/services/api', () => ({
  templatesApi: {
    getAll: vi.fn(() => Promise.resolve([])),
  },
  sendersApi: {
    getAll: vi.fn(() => Promise.resolve([])),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-template-id' }),
    useNavigate: () => vi.fn(),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SequenceEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sequence editor', async () => {
    render(<SequenceEditor />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Sequence Editor')).toBeInTheDocument();
  });

  it('shows add email button', async () => {
    render(<SequenceEditor />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /email/i })).toBeInTheDocument();
  });

  it('shows add wait button', async () => {
    render(<SequenceEditor />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /wait/i })).toBeInTheDocument();
  });

  it('shows save sequence button', async () => {
    render(<SequenceEditor />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('button', { name: /save sequence/i })).toBeInTheDocument();
  });

  it('shows zoom controls', async () => {
    render(<SequenceEditor />, { wrapper: createWrapper() });
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
